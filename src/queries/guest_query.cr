class GuestQuery < Guest::BaseQuery
  def for_event(event : Event)
    event_id(event.id)
  end

  def for_user(user : User)
    user_id(user.id)
  end

  def by_status(status : Guest::Status)
    status(status)
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

  def confirmed_or_attended
    status.in([Guest::Status::Confirmed, Guest::Status::Attended])
  end
end
