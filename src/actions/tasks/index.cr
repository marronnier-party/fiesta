class Tasks::Index < BrowserAction
  get "/tasks" do
    html IndexPage, tasks: TaskQuery.new
  end
end
