class DependentGuestQuery < DependentGuest::BaseQuery
  def for_guest(guest : Guest)
    guest_id(guest.id)
  end

  def for_guest(guest_id : Int64)
    guest_id(guest_id)
  end
end
