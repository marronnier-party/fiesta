class EventMessages::Create < BrowserAction
  post "/events/:event_id/messages" do
    event = EventQuery.find(event_id)

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

    SaveEventMessage.create(
      event_id: event.id,
      user_id: current_user.id,
      content: params.get("content")
    ) do |operation, message|
      if message
        flash.success = r("messaging.message_sent").t
      else
        flash.failure = r("errors.invalid").t
      end
    end

    redirect to: Events::ShowMessages.with(event.id)
  end
end
