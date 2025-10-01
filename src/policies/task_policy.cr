class TaskPolicy < ApplicationPolicy(Task)
  def show?
    # Users can view tasks if they are assigned to them or if they are the event organizer
    assigned_to_user? || organizer?
  end

  def complete?
    # Only the assigned user can complete a task
    assigned_to_user?
  end

  def update?
    # Only the event organizer can update tasks
    organizer?
  end

  def destroy?
    # Only the event organizer can delete tasks
    organizer?
  end

  private def assigned_to_user?
    return false unless guest = record.guest
    guest.user_id == user.id
  end

  private def organizer?
    event = record.event
    event.creator_id == user.id
  end
end
