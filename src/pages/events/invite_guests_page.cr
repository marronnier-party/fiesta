class Events::InviteGuestsPage < MainLayout
  needs event : Event
  needs available_users : Array(User)

  def page_title
    r("events.invite_guests").t
  end

  def content
    div class: "max-w-2xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("events.invite_guests").t, class: "card-title text-3xl mb-2"
          para r("guests.for_event").t(event: event.name), class: "text-base-content/70 mb-6"

          if available_users.empty?
            render_no_users_message
          else
            render_invite_form
          end
        end
      end
    end
  end

  private def render_no_users_message
    div class: "text-center py-8" do
      mount UI::Icon, name: "users", classes: "w-16 h-16 mx-auto mb-4 text-base-content/40"
      para r("guests.all_invited").t, class: "text-base-content/70"
      link r("actions.back").t, to: Events::Show.with(event.id), class: "btn btn-ghost mt-4"
    end
  end

  private def render_invite_form
    form_for Events::InviteGuests.with(event.id), class: "space-y-4" do
      div class: "form-control" do
        label r("guests.select_guests").t, class: "label font-semibold"

        div class: "space-y-2 max-h-96 overflow-y-auto" do
          available_users.each do |user|
            label class: "flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300" do
              input type: "checkbox", name: "user_ids[]", value: user.id.to_s, class: "checkbox checkbox-primary"

              div class: "avatar placeholder" do
                div class: "bg-neutral text-neutral-content rounded-full w-10" do
                  span class: "text-xs" do
                    text user.name.split.map(&.[0]).join.upcase[0..1]
                  end
                end
              end

              div class: "flex-1" do
                div user.name, class: "font-semibold"
                small user.email, class: "text-sm text-base-content/60"
              end
            end
          end
        end
      end

      div class: "card-actions justify-end mt-6" do
        link r("actions.cancel").t, to: Events::Show.with(event.id), class: "btn btn-ghost"
        button r("guests.send_invitations").t, class: "btn btn-primary"
      end
    end
  end
end
