class Events::Create < BrowserAction
  post "/events" do
    SaveEvent.create(params, creator_id: current_user.id) do |operation, event|
      if event
        flash.success = r("events.created_successfully").t
        redirect to: Events::Show.with(event.id)
      else
        flash.failure = r("errors.invalid").t
        html Events::NewPage, save_operation: operation
      end
    end
  end
end
