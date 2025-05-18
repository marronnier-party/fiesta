class Events::Wizard::Creation::UpdateDateTime < Events::WizardAction
  post "/events/wizard/update_datetime" do
    authorize_user(event)

    SaveEvent.update(event, params) do |operation, updated_event|
      if operation.saved?
        if htmx?
          component Events::Wizard::Creation::Container,
            current_step: 3,
            event: updated_event
        else
          redirect to: Events::Wizard::New.with(
            current_step: 3,
            event_id: updated_event.id
          )
        end
      else
        if htmx?
          component Events::Wizard::Creation::Container,
            current_step: 2,
            event: event
        else
          redirect to: Events::Wizard::New.with(
            current_step: 2,
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
