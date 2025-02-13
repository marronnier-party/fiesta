class Locations::Wizard::UpdateAddress < BrowserAction
  include Auth::RequireSignIn

  param location : Location::SaveParams

  post "/locations/wizard/update_address/:location_id" do
    location = LocationQuery.find(location_id)

    authorize_user(location)

    SaveLocation.update(location, params) do |operation, updated_location|
      if operation.saved?
        if htmx?
          component Locations::Wizard::Creation.new(
            current_step: 3,
            location: updated_location,
            parent_event: location.event
          )
        else
          redirect to: Locations::Wizard::New.with(
            current_step: 3,
            location_id: updated_location.id
          )
        end
      else
        if htmx?
          component Locations::Wizard::Creation.new(
            current_step: 2,
            location: location,
            parent_event: location.event
          )
        else
          redirect to: Locations::Wizard::New.with(
            current_step: 2,
            location_id: location.id
          )
        end
      end
    end
  end

  private def authorize_user(location)
    if location.creator_id != current_user.id
      raise Lucky::ForbiddenError.new("Not authorized to update this location")
    end
  end
end
