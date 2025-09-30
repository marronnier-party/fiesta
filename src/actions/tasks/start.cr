class Tasks::Start < BrowserAction
  include Auth::RequireSignIn
  include RequireTaskFromId
  include Rosetta::Translatable

  post "/tasks/:task_id/start" do
    # Ensure user is the assigned guest
    if guest = task.guest
      if guest.user_id != current_user.id
        flash.failure = r("errors.unauthorized").t
        redirect to: Me::Show
      end
    else
      flash.failure = r("tasks.not_assigned").t
      redirect to: Me::Show
    end

    SaveTask.update(task, status: Task::Status::InProgress) do |operation, updated_task|
      if updated_task
        flash.success = r("tasks.started_successfully").t
        redirect to: Events::Show.with(task.event_id)
      else
        flash.failure = r("tasks.start_failed").t
        redirect to: Me::Show
      end
    end
  end
end
