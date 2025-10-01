class EventPolicy < ApplicationPolicy(Event)
  def show?
    # Users can view events if they are the organizer or if they are invited as a guest
    organizer? || guest?
  end

  def update?
    organizer?
  end

  def destroy?
    organizer?
  end

  def check_in_mode?
    organizer?
  end

  def add_task?
    organizer?
  end

  def invite_guests?
    organizer?
  end

  def export_calendar?
    # Only organizer or confirmed guests can export calendar
    organizer? || confirmed_guest?
  end

  def show_messages?
    # Organizer or confirmed guests can view messages
    organizer? || confirmed_guest?
  end

  def expense_split?
    organizer?
  end

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
