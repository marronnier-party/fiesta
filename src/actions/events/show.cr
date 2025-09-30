class Events::Show < BrowserAction
  get "/events/:event_id" do
    event = EventQuery.new
      .preload_creator
      .preload_location
      .find(event_id)

    # Load guests with preloaded user data
    guests = GuestQuery.new
      .for_event(event)
      .preload_user
      .results

    # Load tasks for this event
    tasks = TaskQuery.new
      .for_event(event)
      .preload_guest
      .results

    # Find current user's guest record if they're invited
    user_guest = guests.find { |g| g.user_id == current_user.id }

    html ShowPage,
      event: event,
      guests: guests,
      tasks: tasks,
      user_guest: user_guest
  end
end
