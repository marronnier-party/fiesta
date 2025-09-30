class Tasks::Complete < BrowserAction
  include RequireTaskFromId

  get "/tasks/:task_id/complete" do
    html CompletePage, task: task
  end

  post "/tasks/:task_id/complete" do
    SaveTask.update(task, status: Task::Status::Completed, completed_at: Time.utc) do |operation, updated_task|
      if operation.saved?
        flash.success = "Task marked as complete!"
        redirect to: Me::Show
      else
        flash.failure = "Could not complete task"
        html CompletePage, task: task
      end
    end
  end
end
