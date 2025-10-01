module Policies::Concerns::EventAuthorizationHelpers
  # For policies where record IS an Event
  private def organizer?
    return false unless current_user = user
    record.creator_id == current_user.id
  end

  private def guest?
    return false unless current_user = user
    GuestQuery.new
      .event_id(record.id)
      .user_id(current_user.id)
      .first?
      .present?
  end

  private def confirmed_guest?
    return false unless current_user = user
    GuestQuery.new
      .event_id(record.id)
      .user_id(current_user.id)
      .confirmed
      .first?
      .present?
  end
end
