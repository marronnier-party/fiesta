class Tasks::Update < BrowserAction
  put "/tasks/:task_id" do
    task = TaskQuery.find(task_id)
    SaveTask.update(task, params) do |operation, updated_task|
      if operation.saved?
        flash.success = "The record has been updated"
        redirect Show.with(updated_task.id)
      else
        flash.failure = "It looks like the form is not valid"
        html EditPage, operation: operation, task: updated_task
      end
    end
  end
end
