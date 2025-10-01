class Tasks::Modify < BrowserAction
  include RequireTaskFromId

  private def task_query
    TaskQuery.new.preload_event.preload_guest
  end

  put "/tasks/:task_id" do
    authorize task, policy: TaskPolicy, query: :update?

    SaveTask.update(task, params) do |operation, updated_task|
      if operation.saved?
        flash.success = r("tasks.updated_successfully").t
        redirect Events::Show.with(updated_task.event_id)
      else
        flash.failure = r("tasks.update_failed").t
        html EditPage, operation: operation, task: updated_task
      end
    end
  end
end
