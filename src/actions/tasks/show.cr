class Tasks::Show < BrowserAction
  get "/tasks/:task_id" do
    html ShowPage, task: TaskQuery.find(task_id)
  end
end
