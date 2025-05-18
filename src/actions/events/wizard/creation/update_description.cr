class Events::Wizard::UpdateDescription < Events::WizardAction
  post "/events/wizard/update_description/:event_id" do
    SaveEvent.update(event, params) do |operation, updated_event|
      if operation.saved?
        if htmx?
          component Events::Wizard::Creation::Container,
            current_step: 5,
            event: updated_event,
            current_user: current_user

        else
          redirect to: Events::Wizard::New.with(
            current_step: 5,
            event_id: updated_event.id
          )
        end
      else
        if htmx?
          component Events::Wizard::Creation::Container,
            current_step: 4,
            event: event,
            current_user: current_user

        else
          redirect to: Events::Wizard::Creation::New.with(
            current_step: 4,
            event_id: event.id
          )
        end
      end
    end
  end
end
