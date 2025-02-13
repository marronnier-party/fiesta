class Locations::Wizard::Done < BrowserAction
  include Auth::RequireSignIn

  get "/locations/wizard/done/:location_id" do
    location = LocationQuery.find(location_id)

    if location.creator_id != current_user.id
      raise Lucky::ForbiddenError.new("Not authorized to access this location")
    end

    SaveLocation.update(location, completed: true) do |operation, updated_location|
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
        redirect to: Locations::Wizard::New.with(
          current_step: 4,
          location_id: location.id
        )
      end
    end
  end
end
