class Locations::Wizard::UpdateAddress < BrowserAction
  include RequireLocationFromId
  param parent_event_id : Int64? # Optional, for when creating from event wizard


  post "/locations/wizard/update_address/:location_id" do
    authorize_user(location)

    parent_event = parent_event_id.try { |id| EventQuery.find(id) }


    SaveLocation.update(location, params) do |operation, updated_location|
      if operation.saved?
        if htmx?
          component Locations::Wizard::Container,
            current_step: 3,
            location: updated_location,
            parent_event: parent_event
        else
          redirect to: Locations::Wizard::New.with(
            current_step: 3,
            location_id: updated_location.id
          )
        end
      else
        if htmx?
          component Locations::Wizard::Container,
            current_step: 2,
            location: location,
            parent_event: parent_event
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
      raise "Not authorized to update this location"
    end
  end
end
