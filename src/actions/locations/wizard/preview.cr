class Locations::Wizard::Preview < BrowserAction
  include RequireLocationFromId
  param parent_event_id : Int64? # Optional, for when creating from event wizard


  get "/locations/wizard/preview/:location_id" do
    if location.creator_id != current_user.id
      raise "Not authorized to access this location"
    end

    parent_event = parent_event_id.try { |id| EventQuery.find(id) }

    if htmx?
      component Locations::Wizard::CreationContainer,
        current_step: 4,
        location: location,
        parent_event: parent_event
    else
      redirect to: Locations::Wizard::New.with(
        current_step: 4,
        location_id: location.id
      )
    end
  end
end
