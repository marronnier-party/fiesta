class Locations::Wizard::GoToStep < BrowserAction
  include RequireLocationFromId

  param current_step : Int32
  param parent_event_id : Int64?

  get "/locations/wizard/go_to_step" do
    location = LocationQuery.find(location_id)
    parent_event = parent_event_id.try { |id| EventQuery.find(id) }

    if location.creator_id != current_user.id
      raise "Not authorized to access this location"
    end

    if htmx?
      component Locations::Wizard::Container,
        current_step: current_step,
        location: location,
        parent_event: parent_event

    else
      redirect to: Locations::Wizard::New.with(
        current_step: current_step,
        location_id: location_id,
        parent_event_id: parent_event_id
      )
    end
  end
end
