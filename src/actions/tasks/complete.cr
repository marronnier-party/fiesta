class Tasks::Complete < BrowserAction
  include RequireTaskFromId

  get "/tasks/:task_id/complete" do
    # Preload associations for authorization check
    loaded_task = TaskQuery.preload_guest(TaskQuery.preload_event(task))
    authorize loaded_task, policy: TaskPolicy, query: :complete?
    html CompletePage, task: loaded_task
  end

  post "/tasks/:task_id/complete" do
    # Preload associations for authorization check
    loaded_task = TaskQuery.preload_guest(TaskQuery.preload_event(task))
    authorize loaded_task, policy: TaskPolicy, query: :complete?

    SaveTask.update(loaded_task, params, status: Task::Status::Completed, completed_at: Time.utc) do |operation, updated_task|
      if operation.saved?
        flash.success = r("tasks.completed_successfully").t
        redirect to: Me::Show
      else
        flash.failure = r("tasks.completion_failed").t
        html CompletePage, task: loaded_task
      end
    end
  end
end
