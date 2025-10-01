class GuestPolicy < ApplicationPolicy(Guest)
  def rsvp?
    return false unless current_user = user
    # Users can RSVP if they are the guest
    record.user_id == current_user.id
  end

  def check_in?
    # Only the event organizer can check in guests
    organizer?
  end

  def undo_check_in?
    # Only the event organizer can undo check-in
    organizer?
  end

  private def organizer?
    return false unless current_user = user
    event = record.event
    event.creator_id == current_user.id
  end
end
