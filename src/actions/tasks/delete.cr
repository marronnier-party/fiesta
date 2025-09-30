class Tasks::Delete < BrowserAction
  include Auth::RequireSignIn
  include RequireTaskFromId
  include Rosetta::Translatable

  delete "/tasks/:task_id" do
    event = EventQuery.find(task.event_id)

    # Only organizer can delete tasks
    unless event.creator_id == current_user.id
      flash.failure = r("errors.unauthorized").t
      redirect to: Events::Show.with(event.id)
    end

    task.delete

    flash.success = r("tasks.deleted_successfully").t
    redirect to: Events::Show.with(event.id)
  end
end
