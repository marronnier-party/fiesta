class Tasks::Edit < BrowserAction
  include RequireTaskFromId

  # Preload associations needed for authorization and display
  private def task_query
    TaskQuery.new.preload_event.preload_guest
  end

  get "/tasks/:task_id/edit" do
    authorize task, policy: TaskPolicy, query: :update?

    html EditPage,
      operation: SaveTask.new(task),
      task: task
  end
end
