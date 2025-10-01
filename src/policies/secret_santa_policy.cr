class SecretSantaPolicy < ApplicationPolicy(SecretSanta)
  def show?
    # Users can view Secret Santa if they are organizer or a confirmed guest
    organizer? || confirmed_guest?
  end

  def enable?
    organizer?
  end

  def randomize?
    organizer?
  end

  def toggle_lock?
    organizer?
  end

  private def organizer?
    event = record.event
    event.creator_id == user.id
  end

  private def confirmed_guest?
    event = record.event
    GuestQuery.new
      .event_id(event.id)
      .user_id(user.id)
      .confirmed
      .first?
      .present?
  end
end
