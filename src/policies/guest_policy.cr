class GuestPolicy < ApplicationPolicy(Guest)
  def rsvp?
    # Users can RSVP if they are the guest
    record.user_id == user.id
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
    event = record.event
    event.creator_id == user.id
  end
end
