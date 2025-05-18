class Locations::Wizard::NameAndCreate < BrowserAction
  param parent_event_id : Int32?

  post "/locations/wizard/name_and_create" do
    parent_event = parent_event_id.try { |id| EventQuery.find(id) }
    SaveLocation.create(params, creator_id: current_user.id) do |operation, location|
      if operation.saved?
        component Locations::Wizard::Container,
          current_step: 2,
          location: location.not_nil!,
          current_user: current_user,
          parent_event: parent_event
      else
        component Locations::Wizard::Container,
          current_step: 1,
          location: location,
          current_user: current_user,
          parent_event: parent_event
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
