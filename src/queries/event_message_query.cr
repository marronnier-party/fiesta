class EventMessageQuery < EventMessage::BaseQuery
  def for_event(event : Event)
    event_id(event.id)
  end

  def for_event(event_id : Int64)
    event_id(event_id)
  end

  def recent
    order_by(:created_at, :desc)
  end
end
