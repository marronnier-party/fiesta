class Polls::ShowPage < MainLayout
  needs poll : Poll
  needs event : Event
  needs options_with_counts : Array(NamedTuple(option: PollOption, vote_count: Int64))
  needs user_vote : PollVote?

  def page_title
    poll.question
  end

  def content
    div class: "max-w-4xl mx-auto px-4 py-8" do
      div class: "mb-6" do
        link r("actions.back").t + " " + event.name, to: Events::Show.with(event.id), class: "btn btn-ghost btn-sm"
      end

      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          # Poll question and status
          div class: "flex justify-between items-start mb-6" do
            h1 poll.question, class: "card-title text-3xl"
            mount UI::Badge,
              text: poll.is_locked ? r("polls.locked_badge").t : r("polls.open_badge").t,
              variant: poll.is_locked ? "warning" : "success"
          end

          # Total votes
          total_votes = options_with_counts.sum(&.[:vote_count])
          para r("polls.total_votes").t(count: total_votes), class: "text-gray-600 mb-6"

          # Poll options with results
          div class: "space-y-4" do
            options_with_counts.each do |item|
              option = item[:option]
              vote_count = item[:vote_count]
              percentage = total_votes > 0 ? (vote_count.to_f / total_votes * 100).round(1) : 0.0
              is_user_choice = user_vote && user_vote.not_nil!.poll_option_id == option.id

              div class: "card bg-base-200 #{is_user_choice ? "border-2 border-primary" : ""}" do
                div class: "card-body p-4" do
                  div class: "flex justify-between items-center mb-2" do
                    div do
                      h3 option.option_text, class: "font-semibold"
                      if is_user_choice
                        span r("polls.your_vote").t, class: "text-sm text-primary"
                      end
                    end
                    div class: "text-right" do
                      para "#{vote_count} #{r("polls.votes").t}", class: "font-semibold"
                      para "#{percentage}%", class: "text-sm text-gray-600"
                    end
                  end

                  # Progress bar
                  div class: "w-full bg-gray-300 rounded-full h-2" do
                    div class: "bg-primary h-2 rounded-full", style: "width: #{percentage}%"
                  end

                  # Vote button
                  unless poll.is_locked
                    form_for Polls::Vote.with(poll.id), class: "mt-2" do
                      input type: "hidden", name: "poll_option_id", value: option.id.to_s
                      if is_user_choice
                        button r("polls.vote_for_this").t,
                               class: "btn btn-sm btn-outline btn-primary",
                               disabled: "disabled"
                      else
                        button r("polls.vote_for_this").t,
                               class: "btn btn-sm btn-outline btn-primary"
                      end
                    end
                  end
                end
              end
            end
          end

          # Lock/Unlock button for creator
          if event.creator_id == current_user.id
            div class: "divider" 
            div class: "card-actions justify-end mt-6" do
              link r("actions.delete").t,
                to: Polls::Delete.with(poll.id),
                data_confirm: r("actions.confirm_delete").t,
                "data-method": "delete",
                class: "btn btn-ghost text-error"

              form_for Polls::ToggleLock.with(poll.id), class: "inline" do
                if poll.is_locked
                  button r("polls.unlock").t, class: "btn btn-warning"
                else
                  button r("polls.lock").t, class: "btn btn-success"
                end
              end
            end
          end
        end
      end
    end
  end
end
