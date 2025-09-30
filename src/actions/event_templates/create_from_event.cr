class EventTemplates::CreateFromEvent < BrowserAction
  post "/events/:event_id/create_template" do
    event = EventQuery.new
      .preload_location
      .preload_creator
      .find(event_id)

    # Only creator can create templates from their events
    if event.creator_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Events::Show.with(event.id)
    end

    # Get tasks for this event
    tasks = TaskQuery.new.for_event(event).results
    task_templates = tasks.map do |task|
      {
        "name" => task.name,
        "category" => task.category || ""
      }
    end

    # Get confirmed guest IDs (user_id from Guest model)
    confirmed_guests = GuestQuery.new
      .for_event(event)
      .confirmed
      .results
      .map(&.user_id)

    template_name = params.get?("template_name") || "#{event.name} #{r("event_templates.template_suffix").t}"

    SaveEventTemplate.create!(
      name: template_name,
      description: event.description,
      location_id: event.location_id,
      creator_id: current_user.id,
      task_templates: task_templates.to_json,
      default_guest_ids: confirmed_guests.to_json
    )

    flash.success = r("event_templates.created_from_event").t
    redirect to: EventTemplates::Index
  end
end
