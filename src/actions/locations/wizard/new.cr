class Locations::Wizard::New < BrowserAction
  include Auth::RequireSignIn

  param current_step : Int32 = 1
  param parent_event_id : Int64? # Optional, for when creating from event wizard

  get "/locations/wizard/new" do
    location = Location.new
    parent_event = parent_event_id.try { |id| EventQuery.find(id) }

    if htmx?
      component Locations::Wizard::Creation.new(
        current_step: current_step,
        location: location,
        parent_event: parent_event
      )
    else
      html NewPage,
        current_step: current_step,
        location: location,
        parent_event: parent_event
    end
  end
end
