module RequireEventFromId
  macro included
    param event_id : Int64
    before require_event_from_id
  end

  memoize def event? : Event?
    return EventQuery.new.id(event_id).first
  end

  private def event : Event
    event?.as(Event)
  end

  private def require_event_from_id
    if event
      continue
    else
      plain_text "Event not found"
    end
  end
end
