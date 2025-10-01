class Events::AddTask < BrowserAction
  include RequireEventWithCreator

  get "/events/:event_id/tasks/new" do
    authorize event, policy: EventPolicy, query: :add_task?

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
    authorize event, policy: EventPolicy, query: :add_task?

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
