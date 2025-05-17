class Events::Wizard::Creation::UpdateLocation < Events::WizardAction
  include RequireLocationFromId
  param location_id : Int64

  post "/events/wizard/update_location/:event_id" do
    event = EventQuery.find(event_id)
    location = LocationQuery.find(location_id)

    authorize_user(event)

    SaveEvent.update(event, location_id: location_id) do |operation, updated_event|
      if operation.saved?
        if htmx?
          component Events::Wizard::CreationContainer,
            current_step: 4,
            event: updated_event,
            location: location,
            current_user: current_user

        else
          redirect to: Events::Wizard::Creation::New.with(
            current_step: 4,
            event_id: updated_event.id
          )
        end
      else
        if htmx?
          component Events::Wizard::CreationContainer,
            current_step: 3,
            event: event,
            current_user: current_user

        else
          redirect to: Events::Wizard::Creation::New.with(
            current_step: 3,
            event_id: event.id
          )
        end
      end
    end
  end

  private def authorize_user(event)
    if event.creator_id != current_user.id
      raise "Not authorized to update this event"
    end
  end
end
