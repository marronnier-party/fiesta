class Tasks::Start < BrowserAction
  include RequireTaskFromId

  # Preload associations needed for authorization
  private def task_query
    TaskQuery.new.preload_event.preload_guest
  end

  post "/tasks/:task_id/start" do
    authorize task, policy: TaskPolicy, query: :start?

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
