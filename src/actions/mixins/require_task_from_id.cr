module RequireTaskFromId
  macro included
    include Rosetta::Translatable
    before enforce_task_found
  end

  private def task : Task
    @_task.not_nil!
  end

  private def enforce_task_found
    task_id = params.get(:task_id).to_i64
    @_task = TaskQuery.find(task_id)
    continue
  rescue Avram::RecordNotFoundError
    flash.failure = r("tasks.not_found").t
    redirect to: Me::Show
  end
end
