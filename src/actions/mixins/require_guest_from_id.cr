module RequireGuestFromId
  macro included
    before enforce_guest_found
  end

  private def guest : Guest
    @_guest.not_nil!
  end

  private def enforce_guest_found
    guest_id = params.get(:guest_id).to_i64
    @_guest = GuestQuery.find(guest_id)
    continue
  rescue Avram::RecordNotFoundError
    flash.failure = "Guest invitation not found"
    redirect to: Me::Show
  end
end
