class Me::Show < BrowserAction
  get "/me" do
    # Query pending invitations (awaiting response)
    pending_invitations = GuestQuery.new
      .for_user(current_user)
      .awaiting_response
      .preload_event
      .preload_dependent_guests
      .results

    # Query confirmed events
    confirmed_events = GuestQuery.new
      .for_user(current_user)
      .confirmed
      .preload_event
      .preload_dependent_guests
      .results

    # Query user's tasks - simplified for now
    user_tasks = [] of Task

    html ShowPage,
      pending_invitations: pending_invitations,
      confirmed_events: confirmed_events,
      user_tasks: user_tasks
  end
end
