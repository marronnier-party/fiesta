class Events::MessagesPage < MainLayout
  needs event : Event
  needs messages : Array(EventMessage)

  def page_title
    r("messaging.title").t + " - " + event.name
  end

  def content
    div class: "max-w-4xl mx-auto px-4 py-8" do
      div class: "mb-6" do
        link r("actions.back").t + " " + event.name, to: Events::Show.with(event.id), class: "btn btn-ghost btn-sm"
      end

      div class: "space-y-6" do
        render_header
        render_messages
        render_message_form
      end
    end
  end

  private def render_header
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h1 r("messaging.title").t, class: "card-title text-3xl"
        para "Discussion de groupe pour tous les participants confirmés", class: "text-base-content/70"
      end
    end
  end

  private def render_messages
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        if messages.empty?
          div class: "text-center py-8 text-base-content/60" do
            icon "message-circle", "w-12 h-12 mx-auto mb-2 opacity-40"
            para r("messaging.no_messages").t
          end
        else
          div class: "space-y-4 max-h-96 overflow-y-auto" do
            messages.reverse.each do |message|
              render_message(message)
            end
          end
        end
      end
    end
  end

  private def render_message(message : EventMessage)
    is_current_user = message.user_id == current_user.id

    div class: "flex gap-3 #{is_current_user ? "flex-row-reverse" : ""}" do
      div class: "avatar placeholder" do
        div class: "bg-neutral text-neutral-content rounded-full w-10" do
          span class: "text-xs" do
            text message.user!.name[0..0].upcase
          end
        end
      end

      div class: "flex-1 max-w-md" do
        div class: "#{is_current_user ? "bg-primary text-primary-content" : "bg-base-200"} rounded-lg p-3" do
          if !is_current_user
            div message.user!.name, class: "font-semibold text-sm mb-1"
          end
          para message.content, class: "text-sm whitespace-pre-wrap"
          small class: "text-xs opacity-70 mt-1 block" do
            text format_relative_time(message.created_at)
          end
        end
      end
    end
  end

  private def render_message_form
    div class: "card bg-base-100 shadow-xl sticky bottom-4" do
      div class: "card-body" do
        form_for EventMessages::Create.with(event.id) do
          div class: "form-control" do
            tag "textarea",
              name: "content",
              class: "textarea textarea-bordered",
              placeholder: r("messaging.message_placeholder").t,
              rows: "3",
              required: true
          end

          div class: "flex justify-end mt-4" do
            button r("messaging.send_message").t, class: "btn btn-primary"
          end
        end
      end
    end
  end

  private def format_relative_time(time : Time)
    diff = Time.utc - time
    minutes = diff.total_minutes.to_i

    if minutes < 1
      r("time.just_now").t
    elsif minutes < 60
      r("time.minutes_ago").t(count: minutes)
    elsif minutes < 1440
      hours = (minutes / 60).to_i
      r("time.hours_ago").t(count: hours)
    else
      days = (minutes / 1440).to_i
      r("time.days_ago").t(count: days)
    end
  end
end
