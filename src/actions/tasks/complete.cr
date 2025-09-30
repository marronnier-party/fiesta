class Tasks::Complete < BrowserAction
  include RequireTaskFromId

  get "/tasks/:task_id/complete" do
    html CompletePage, task: task
  end

  post "/tasks/:task_id/complete" do
    SaveTask.update(task, status: Task::Status::Completed, completed_at: Time.utc) do |operation, updated_task|
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
