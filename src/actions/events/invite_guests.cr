class Events::InviteGuests < BrowserAction
  include RequireEventWithCreator

  get "/events/:event_id/invite" do
    authorize event, policy: EventPolicy, query: :invite_guests?

    # Get all users except those already invited
    invited_user_ids = GuestQuery.new.for_event(event).results.map(&.user_id)
    available_users = UserQuery.new.results.reject { |u| invited_user_ids.includes?(u.id) || u.id == current_user.id }

    html InviteGuestsPage,
      event: event,
      available_users: available_users
  end

  post "/events/:event_id/invite" do
    event = EventQuery.find(event_id)

    authorize event, policy: EventPolicy, query: :invite_guests?

    user_ids = params.get_all?(:user_ids) || [] of String

    user_ids.each do |user_id|
      SaveGuest.create(
        event_id: event.id,
        user_id: user_id.to_i64,
        status: Guest::Status::NoAnswer,
        guest_count: 1
      ) do |operation, guest|
        # Ignore errors if guest already exists
      end
    end

    flash.success = r("guests.invited_successfully").t
    redirect to: Events::Show.with(event.id)
  end
end
