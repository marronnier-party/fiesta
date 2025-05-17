class Locations::Wizard::New < BrowserAction
  param current_step : Int32 = 1
   param location_id : Int64?
  param parent_event_id : Int64? # Optional, for when creating from event wizard

  get "/locations/wizard/new" do
    location = location_id.try { |id| LocationQuery.find(id) }
    parent_event = parent_event_id.try { |id| EventQuery.find(id) }

    if htmx?
      component Locations::Wizard::CreationContainer,
        current_step: current_step,
        location: location,
        parent_event: parent_event

    else
      html NewPage,
        current_step: current_step,
        location: location,
        parent_event: parent_event
    end
  end
end
