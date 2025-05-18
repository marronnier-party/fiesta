class Locations::Wizard::Done < BrowserAction
  include RequireLocationFromId
  param parent_event_id : Int64? # Optional, for when creating from event wizard


  get "/locations/wizard/done/:location_id" do
    if location.creator_id != current_user.id
      raise "Not authorized to access this location"
    end

    SaveLocation.update(location) do |operation, updated_location|
      if operation.saved?
        if parent_event_id
          # If we came from event wizard, return there
          redirect to: Events::Wizard::Creation::GoToStep.with(
            current_step: 3,
            event_id: parent_event_id.not_nil!
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
