class Events::Wizard::New < BrowserAction
  include Auth::RequireSignIn

  param current_step : Int32 = 1

  get "/events/wizard/new" do
    event = nil
    location = nil

    if htmx?
      # If it's an HTMX request, return only the component
      html Events::Wizard::Creation.new(
        current_step: current_step,
        event: event,
        location: location,
        current_user: current_user
      )
    else
      # For regular requests, render the full page
      html NewPage,
        current_step: current_step,
        event: event,
        location: location,
        current_user: current_user
    end
  end
end
