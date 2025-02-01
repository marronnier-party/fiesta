class Events::Update < BrowserAction
  put "/events/:event_id" do
    event = EventQuery.find(event_id)
    SaveEvent.update(event, params) do |operation, updated_event|
      if operation.saved?
        flash.success = "The record has been updated"
        redirect Show.with(updated_event.id)
      else
        flash.failure = "It looks like the form is not valid"
        html EditPage, operation: operation, event: updated_event
      end
    end
  end
end
