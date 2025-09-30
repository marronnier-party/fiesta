class NotificationQuery < Notification::BaseQuery
  def for_user(user : User)
    user_id(user.id)
  end

  def for_event(event : Event)
    event_id(event.id)
  end

  def pending
    status(Notification::Status::Pending)
  end

  def due_now
    pending.where("scheduled_for <= ?", Time.utc)
  end

  def unread
    pending
  end
end
