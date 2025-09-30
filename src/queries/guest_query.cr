class GuestQuery < Guest::BaseQuery
  def for_event(event : Event)
    event_id(event.id)
  end

  def for_user(user : User)
    user_id(user.id)
  end

  def by_status(status : Guest::Status)
    where(&.status.==(status))
  end

  def confirmed
    by_status(Guest::Status::Confirmed)
  end

  def awaiting_response
    by_status(Guest::Status::NoAnswer)
  end

  def declined
    by_status(Guest::Status::Declined)
  end

  # Temporarily disabled - causing compilation issues
  # def with_upcoming_events
  #   preload_event.where_event do |event|
  #     event.start_at.gt(Time.utc)
  #   end
  # end

  # def with_past_events
  #   preload_event.where_event do |event|
  #     event.start_at.lt(Time.utc)
  #   end
  # end

  def ordered_by_event_date
    preload_event
      .order_by(:event_id, :asc) # Will order by associated event's start_at
  end
end
