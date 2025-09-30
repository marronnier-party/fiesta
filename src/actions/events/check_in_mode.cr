class Events::CheckInMode < BrowserAction
  get "/events/:event_id/checkin" do
    event = EventQuery.new
      .preload_creator
      .find(event_id)

    # Only allow organizer to access check-in mode
    unless event.creator_id == current_user.id
      flash.failure = r("errors.unauthorized").t
      redirect to: Events::Show.with(event.id)
    end

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
