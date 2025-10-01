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
    mount UI::EmptyState,
      title: r("guests.all_invited").t,
      icon_name: "users",
      action_text: r("actions.back").t,
      action_path: Events::Show.with(event.id),
      button_variant: "btn-ghost",
      with_card: false
  end

  private def render_invite_form
    form_for Events::InviteGuests.with(event.id), class: "space-y-4" do
      div class: "form-control" do
        label r("guests.select_guests").t, class: "label font-semibold"

        mount UI::CheckboxList(User),
          items: available_users,
          name: "user_ids[]",
          item_value: ->(u : User) { u.id.to_s },
          item_label: ->(u : User) { u.name },
          item_subtitle: ->(u : User) { u.email },
          show_avatar: true
      end

      div class: "card-actions justify-end mt-6" do
        link r("actions.cancel").t, to: Events::Show.with(event.id), class: "btn btn-ghost"
        button r("guests.send_invitations").t, class: "btn btn-primary"
      end
    end
  end
end
