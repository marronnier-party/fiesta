class EventQuery < Event::BaseQuery
  def for_user(user : User)
    creator_id(user.id)
  end

  def by_status(status : Event::Status)
    status(status)
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
