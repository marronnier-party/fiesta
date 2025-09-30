class EventActivityQuery < EventActivity::BaseQuery
  def for_event(event_id : Int64)
    event_id(event_id)
  end

  def recent
    order_by(:created_at, :desc).limit(20)
  end
end
