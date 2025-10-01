class Events::QuickAddTask < BrowserAction
  post "/events/:event_id/tasks/quick_add" do
    event = EventQuery.find(event_id)

    # Authorization check
    unless event.creator_id == current_user.id
      if htmx_request?
        head 403
      else
        redirect_back fallback: Events::Show.with(event_id)
      end
      return
    end

    task_name = params.get("task:name")

    task = Task.create!(
      event_id: event_id,
      name: task_name,
      status: Task::Status::Pending
    )

    if htmx_request?
      # Return new task card with confirmation dialog
      guests = GuestQuery.new.event_id(event_id).preload_user.results

      html_string do
        mount Tasks::TaskCard,
          task: task,
          comments: [] of Comment,
          current_user: current_user,
          is_organizer: true,
          guests: guests,
          can_comment: true

        # Add confirmation dialog for the new task
        mount UI::ConfirmDialog,
          id: "confirm-delete-task-#{task.id}",
          title: r("actions.confirm").t,
          message: r("tasks.delete_confirm").t(name: task.name),
          confirm_text: r("actions.delete").t,
          cancel_text: r("actions.cancel").t,
          confirm_class: "btn-error"
      end

      # Also add success header
      htmx_success_message(r("tasks.created_successfully").t)
    else
      flash.success = r("tasks.created_successfully").t
      redirect to: Events::Show.with(event_id)
    end
  end
end

