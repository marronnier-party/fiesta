class Tasks::Reassign < BrowserAction
  include Auth::RequireSignIn
  include RequireTaskFromId
  include Rosetta::Translatable

  post "/tasks/:task_id/reassign" do
    # Check if user is the event organizer
    event = EventQuery.new.id(task.event_id).first

    if event.creator_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      redirect to: Me::Show
    end

    # Get the new guest ID from params
    new_guest_id = params.get?("guest_id").try(&.to_i64)

    if new_guest_id.nil?
      flash.failure = r("tasks.reassign_failed").t
      redirect to: Events::Show.with(task.event_id)
    end

    # Verify the new guest is part of this event
    new_guest = GuestQuery.new
      .id(new_guest_id.not_nil!)
      .event_id(task.event_id)
      .status(Guest::Status::Confirmed)
      .first?

    if new_guest.nil?
      flash.failure = r("tasks.guest_not_found").t
      redirect to: Events::Show.with(task.event_id)
    end

    SaveTask.update(task, guest_id: new_guest_id) do |operation, updated_task|
      if updated_task
        flash.success = r("tasks.reassigned_successfully").t
        redirect to: Events::Show.with(task.event_id)
      else
        flash.failure = r("tasks.reassign_failed").t
        redirect to: Events::Show.with(task.event_id)
      end
    end
  end
end
