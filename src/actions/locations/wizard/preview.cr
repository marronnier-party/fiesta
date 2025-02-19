class Locations::Wizard::Preview < BrowserAction
  include RequireLocationFromId

  get "/locations/wizard/preview/:location_id" do
    if location.creator_id != current_user.id
      raise Lucky::ForbiddenError.new("Not authorized to access this location")
    end

    if htmx?
      component Locations::Wizard::Creation.new(
        current_step: 4,
        location: location,
        parent_event: location.event
      )
    else
      redirect to: Locations::Wizard::New.with(
        current_step: 4,
        location_id: location.id
      )
    end
  end
end
