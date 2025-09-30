class EventQuery < Event::BaseQuery
  def for_user(user : User)
    creator_id(user.id)
  end

  def upcoming
    start_at.gt(Time.utc)
  end

  def past
    start_at.lt(Time.utc)
  end

  def by_status(status : Event::Status)
    where(&.status.==(status))
  end

  def drafts
    by_status(Event::Status::Draft)
  end

  def confirmed
    by_status(Event::Status::Confirmed)
  end

  def ordered_by_date
    order_by(:start_at, :asc)
  end

  def recent
    order_by(:created_at, :desc)
  end
end
