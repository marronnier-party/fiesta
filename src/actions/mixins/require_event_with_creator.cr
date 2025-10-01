module RequireEventWithCreator
  macro included
    include Rosetta::Translatable
    before enforce_event_found

    @_event : Event?
  end

  private def event : Event
    @_event.not_nil!
  end

  private def enforce_event_found
    event_id = params.get(:event_id).to_i64
    @_event = EventQuery.new
      .preload_creator
      .find(event_id)
    continue
  rescue Avram::RecordNotFoundError
    flash.failure = r("events.not_found").t
    redirect to: Me::Show
  end
end
