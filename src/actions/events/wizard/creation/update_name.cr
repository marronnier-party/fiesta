class Events::Wizard::Creation::UpdateName < Events::WizardAction
  post "/events/wizard/update_name/:event_id" do

    SaveEvent.update(event, params) do |operation, updated_event|
      if operation.saved?
        if htmx?
          component Events::Wizard::CreationContainer,
            current_step: 2,
            event: updated_event,
            current_user: current_user

        else
          redirect to: Events::Wizard::New.with(
            current_step: 2,
            event_id: updated_event.id
          )
        end
      else
        if htmx?
          component Events::Wizard::CreationContainer,
            current_step: 1,
            event: event,
            current_user: current_user

        else
          redirect to: Events::Wizard::New.with(
            current_step: 1,
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
