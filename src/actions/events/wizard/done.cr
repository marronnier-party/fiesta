class Events::Wizard::Done < BrowserAction
  include Auth::RequireSignIn

  get "/events/wizard/done/:event_id" do
    event = EventQuery.find(event_id)

    # Verify user owns the event
    if event.creator_id != current_user.id
      raise Lucky::ForbiddenError.new("Not authorized to access this event")
    end

    # Mark the event as completed if needed
    SaveEvent.update(event, completed: true) do |operation, updated_event|
      if operation.saved?
        redirect to: Events::Show.with(event_id: updated_event.id)
      else
        redirect to: Events::Wizard::New.with(
          current_step: 5,
          event_id: event.id
        )
      end
    end
  end
end
