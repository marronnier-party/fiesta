class Tasks::Delete < BrowserAction
  delete "/tasks/:task_id" do
    task = TaskQuery.find(task_id)
    DeleteTask.delete(task) do |_operation, _deleted|
      flash.success = "Deleted the task"
      redirect Index
    end
  end
end
