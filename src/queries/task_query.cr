class TaskQuery < Task::BaseQuery
  def for_event(event : Event)
    event_id(event.id)
  end

  def for_guest(guest : Guest)
    guest_id(guest.id)
  end

  def unassigned
    guest_id.is_nil
  end

  def by_status(status : Task::Status)
    where(&.status.==(status))
  end

  def pending
    by_status(Task::Status::Pending)
  end

  def completed
    by_status(Task::Status::Completed)
  end

  def in_progress
    by_status(Task::Status::InProgress)
  end

  def by_category(category : String)
    where(&.category.==(category))
  end

  def ordered_by_position
    order_by(:position, :asc)
  end
end
