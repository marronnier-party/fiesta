class Events::QuickAddTask < BrowserAction
  post "/events/:event_id/tasks/quick_add" do
    event = EventQuery.find(event_id)

    # Authorization check
    if event.creator_id != current_user.id
      if htmx_request?
        head 403
      else
        redirect_back fallback: Events::Show.with(event_id)
      end
    else
      task_name = params.get("task:name")

      task = SaveTask.create!(
        event_id: event_id.to_i64,
        name: task_name,
        status: Task::Status::Pending
      )

      if htmx_request?
        # Return new task card with confirmation dialog
        guests = GuestQuery.new.event_id(event_id).preload_user.results

        # Reload task with associations
        task = TaskQuery.new.preload_guest.find(task.id)

        # Set success message header
        context.response.headers["X-Success-Message"] = r("tasks.created_successfully").t

        component Tasks::TaskCardWithDialog,
          task: task,
          current_user: current_user,
          guests: guests
      else
        flash.success = r("tasks.created_successfully").t
        redirect to: Events::Show.with(event_id)
      end
    end
  end
end

