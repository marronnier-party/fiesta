class Locations::Wizard::NameAndCreate < BrowserAction
  include Auth::RequireSignIn
  param parent_event_id : Int32?

  post "/locations/wizard/create" do
    case current_step
    when 1
      create_location
    when 2
      update_location_address
    when 3
      finalize_location
    else
      html_with_error("Étape invalide")
    end
  end

  private def create_location
    SaveLocation.create(params, creator_id: current_user.id) do |operation, location|
      if operation.saved?
        component Locations::Wizard::Creation,
          current_step: 2,
          location: location.not_nil!,
          current_user: current_user,
          parent_event: parent_event_id ? EventQuery.find(parent_event_id.not_nil!) : nil
      else
        component Locations::CreationWizard,
          current_step: 1,
          location: operation.location,
          current_user: current_user,
          parent_event: parent_event_id ? EventQuery.find(parent_event_id.not_nil!) : nil
      end
    end
  end

  private def update_location_address
    location = LocationQuery.find(location_id)
    SaveLocation.update(location, params) do |operation, updated_location|
      if operation.saved?
        component Locations::CreationWizard,
          current_step: 3,
          location: updated_location,
          current_user: current_user,
          parent_event: parent_event_id ? EventQuery.find(parent_event_id.not_nil!) : nil
      else
        component Locations::CreationWizard,
          current_step: 2,
          location: operation.location,
          current_user: current_user,
          parent_event: parent_event_id ? EventQuery.find(parent_event_id.not_nil!) : nil
      end
    end
  end

  private def finalize_location
    location = LocationQuery.find(location_id)
    SaveLocation.update(location, params) do |operation, updated_location|
      if operation.saved?
        if parent_event_id
          # If we're creating a location from the event wizard,
          # update the event and return to the event wizard
          event = EventQuery.find(parent_event_id)
          SaveEvent.update!(event, location_id: updated_location.id)

          # Return to event wizard at the description step
          component Events::CreationWizard,
            current_step: 4,
            event: event.reload,
            location: updated_location,
            current_user: current_user
        else
          # If it's a standalone location creation,
          # redirect to the location show page
          response.headers["HX-Redirect"] = Locations::Show.with(id: updated_location.id).path
          html ""
        end
      else
        component Locations::CreationWizard,
          current_step: 3,
          location: operation.location,
          current_user: current_user,
          parent_event: parent_event_id ? EventQuery.find(parent_event_id.not_nil!) : nil
      end
    end
  end

  private def html_with_error(message)
    div class: "alert alert-error" do
      span class: "font-medium" do
        text message
      end
    end
  end

  # Helper method to get parent event if it exists
  private def parent_event : Event?
    parent_event_id ? EventQuery.find(parent_event_id.not_nil!) : nil
  end
end
