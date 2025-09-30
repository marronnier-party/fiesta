class Events::AddTask < BrowserAction
  get "/events/:event_id/tasks/new" do
    event = EventQuery.new
      .preload_creator
      .find(event_id)

    # Only allow creator to add tasks
    unless event.creator_id == current_user.id
      flash.failure = r("errors.unauthorized").t
      redirect to: Events::Show.with(event.id)
    end

    # Get confirmed guests for this event
    guests = GuestQuery.new
      .for_event(event)
      .confirmed
      .preload_user
      .results

    html AddTaskPage,
      event: event,
      guests: guests,
      save_operation: SaveTask.new
  end

  post "/events/:event_id/tasks" do
    event = EventQuery.find(event_id)

    # Only allow creator to add tasks
    unless event.creator_id == current_user.id
      flash.failure = r("errors.unauthorized").t
      redirect to: Events::Show.with(event.id)
    end

    SaveTask.create(params, event_id: event.id) do |operation, task|
      if task
        flash.success = r("tasks.created_successfully").t
        redirect to: Events::Show.with(event.id)
      else
        guests = GuestQuery.new
          .for_event(event)
          .confirmed
          .preload_user
          .results

        flash.failure = r("errors.invalid").t
        html AddTaskPage,
          event: event,
          guests: guests,
          save_operation: operation
      end
    end
  end
end
