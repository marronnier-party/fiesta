class Events::Duplicate < BrowserAction
  include Auth::RequireSignIn
  include RequireEventFromId
  include RequireEventOwnership
  include Rosetta::Translatable

  post "/events/:event_id/duplicate" do
    # Create a new event with duplicated data
    SaveEvent.create(params) do |operation, new_event|
      # Pre-fill the form with existing event data
      operation.name.value = "#{event.name} (copie)"
      operation.description.value = event.description
      operation.location_id.value = event.location_id
      operation.creator_id.value = current_user.id
      operation.status.value = Event::Status::Draft

      if new_event
        flash.success = r("events.duplicated_successfully").t
        redirect to: Events::Edit.with(new_event.id)
      else
        flash.failure = r("events.duplicate_failed").t
        redirect to: Events::Show.with(event.id)
      end
    end
  end
end
