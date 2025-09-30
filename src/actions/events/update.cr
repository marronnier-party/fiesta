class Events::Update < BrowserAction
  include RequireEventFromId
  include RequireEventOwnership

  put "/events/:event_id" do
    SaveEvent.update(event, params) do |operation, updated_event|
      if operation.saved?
        flash.success = r("events.updated_successfully").t
        redirect Show.with(updated_event.id)
      else
        flash.failure = r("errors.invalid").t
        html EditPage, operation: operation, event: updated_event
      end
    end
  end
end
