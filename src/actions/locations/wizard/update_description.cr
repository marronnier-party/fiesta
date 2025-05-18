class Locations::Wizard::UpdateDescription < BrowserAction
  include RequireLocationFromId
  param parent_event_id : Int64?

  post "/locations/wizard/update_description" do
    SaveLocation.update(location, params) do |operation, updated_location|
      if operation.saved?
        if parent_event_id # updated_location.event_ids.include?(parent_event_id.to_s)
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
        if htmx?
          component Locations::Wizard::Container,
            current_step: 3,
            location: location
        else
          redirect to: Locations::Wizard::New.with(
            current_step: 3,
            location_id: location.id
          )
        end
      end
    end
  end
end
