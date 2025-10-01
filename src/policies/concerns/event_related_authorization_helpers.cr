module Policies::Concerns::EventRelatedAuthorizationHelpers
  # For policies where record has an event association
  private def organizer?
    return false unless current_user = user
    event = record.event
    event.creator_id == current_user.id
  end

  private def confirmed_guest?
    return false unless current_user = user
    event = record.event
    GuestQuery.new
      .event_id(event.id)
      .user_id(current_user.id)
      .confirmed
      .first?
      .present?
  end
end
