class Events::CreateFromTemplate < BrowserAction
  get "/event_templates/:event_template_id/create_event" do
    template = EventTemplateQuery.new
      .for_user(current_user)
      .preload_location
      .find(event_template_id)

    # Pre-fill the operation with template data
    save_operation = SaveEvent.new
    save_operation.name.value = template.name
    save_operation.description.value = template.description
    save_operation.location_id.value = template.location_id
    save_operation.status.value = Event::Status::Draft

    locations = LocationQuery.new.for_user(current_user).results

    html Events::NewPage,
      save_operation: save_operation,
      locations: locations
  end
end
