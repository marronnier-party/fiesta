class Events::Create < BrowserAction
  post "/events" do
    SaveEvent.create(params, creator_id: current_user.id) do |operation, event|
      if event
        flash.success = "Event created successfully!"
        redirect to: Events::Show.with(event.id)
      else
        flash.failure = "Could not create event"
        html Events::NewPage, save_operation: operation
      end
    end
  end
end
