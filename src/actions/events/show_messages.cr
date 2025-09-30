class Events::ShowMessages < BrowserAction
  get "/events/:event_id/messages" do
    event = EventQuery.new
      .preload_creator
      .find(event_id)

    # Check if user is invited or is organizer
    unless event.creator_id == current_user.id
      guest = GuestQuery.new
        .for_event(event)
        .user_id(current_user.id)
        .confirmed
        .first?

      unless guest
        flash.failure = r("errors.unauthorized").t
        redirect to: Events::Show.with(event.id)
      end
    end

    messages = EventMessageQuery.new
      .for_event(event)
      .preload_user
      .recent
      .results

    html MessagesPage,
      event: event,
      messages: messages
  end
end
