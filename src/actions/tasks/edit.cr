class Tasks::Edit < BrowserAction
  get "/tasks/:task_id/edit" do
    task = TaskQuery.find(task_id)
    html EditPage,
      operation: SaveTask.new(task),
      task: task
  end
end
