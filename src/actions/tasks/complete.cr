class Tasks::Complete < BrowserAction
  include RequireTaskFromId

  get "/tasks/:task_id/complete" do
    authorize task, policy: TaskPolicy, query: :complete?
    html CompletePage, task: task
  end

  post "/tasks/:task_id/complete" do
    authorize task, policy: TaskPolicy, query: :complete?

    SaveTask.update(task, params, status: Task::Status::Completed, completed_at: Time.utc) do |operation, updated_task|
      if operation.saved?
        flash.success = r("tasks.completed_successfully").t
        redirect to: Me::Show
      else
        flash.failure = r("tasks.completion_failed").t
        html CompletePage, task: task
      end
    end
  end
end
