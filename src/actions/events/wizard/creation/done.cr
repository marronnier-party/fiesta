class Events::Wizard::Creation::Done < Events::WizardAction
  get "/events/wizard/creation/done" do
    # Mark the event as completed if needed
    SaveEvent.update(event) do |operation, updated_event|
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
