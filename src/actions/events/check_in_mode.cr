class Events::CheckInMode < BrowserAction
  get "/events/:event_id/checkin" do
    event = EventQuery.new
      .preload_creator
      .find(event_id)

    authorize event, policy: EventPolicy, query: :check_in_mode?

    # Load confirmed guests
    guests = GuestQuery.new
      .for_event(event)
      .confirmed_or_attended
      .preload_user
      .results

    html CheckInPage,
      event: event,
      guests: guests
  end
end
