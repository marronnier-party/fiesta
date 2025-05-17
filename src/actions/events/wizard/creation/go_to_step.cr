class Events::Wizard::Creation::GoToStep < Events::WizardAction

  param current_step : Int32 = 1

  get "/events/wizard/creation/go_to_step/:event_id" do

    location = event.location # Assuming you have this relation set up

    if htmx?
      component Events::Wizard::CreationContainer,
        current_step: current_step,
        event: event,
        location: location,
        current_user: current_user
    else
      redirect to: Events::Wizard::Creation::New.with(
        current_step: current_step,
        event_id: event.id
      )
    end
  end
end
