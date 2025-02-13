class Locations::Wizard::UpdateDetails < BrowserAction
  include Auth::RequireSignIn

  param location : Location::SaveParams

  post "/locations/wizard/update_details/:location_id" do
    location = LocationQuery.find(location_id)

    authorize_user(location)

    SaveLocation.update(location, params) do |operation, updated_location|
      if operation.saved?
        if parent_event_id = updated_location.event_id
          # If we came from event wizard, return there
          redirect to: Events::Wizard::New.with(
            current_step: 3,
            event_id: parent_event_id
          )
        else
          # Otherwise go to location show page
          redirect to: Locations::Show.with(location_id: updated_location.id)
        end
      else
        if htmx?
          component Locations::Wizard::Creation.new(
            current_step: 3,
            location: location,
            parent_event: location.event
          )
        else
          redirect to: Locations::Wizard::New.with(
            current_step: 3,
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
