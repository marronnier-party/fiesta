class Events::Wizard::New < BrowserAction
  param current_step : Int32 = 1
  param event_id : Int64?

  get "/events/wizard/new" do
    event = nil
    location = nil

    if htmx?
      # If it's an HTMX request, return only the component
      component Events::Wizard::Creation::Container,
        current_step: current_step,
        event: event,
        location: location
    else
      # For regular requests, render the full page
      html Events::Wizard::NewPage,
        current_step: current_step,
        event: event,
        location: location
      end
  end
end
