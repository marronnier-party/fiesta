class Locations::Wizard::GoToStep < BrowserAction
  include RequireLocationFromId

  param current_step : Int32

  get "/locations/wizard/go_to_step/:location_id" do
    location = LocationQuery.find(location_id)

    if location.creator_id != current_user.id
      raise Lucky::ForbiddenError.new("Not authorized to access this location")
    end

    if htmx?
      component Locations::Wizard::Creation.new(
        current_step: current_step,
        location: location,
        parent_event: location.event
      )
    else
      redirect to: Locations::Wizard::New.with(
        current_step: current_step,
        location_id: location.id
      )
    end
  end
end
