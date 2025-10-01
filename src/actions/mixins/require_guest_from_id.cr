module RequireGuestFromId
  macro included
    include Rosetta::Translatable
    before enforce_guest_found

    @_guest : Guest?
  end

  # Override this to customize preloading
  private def guest_query
    GuestQuery.new
  end

  private def guest : Guest
    @_guest.not_nil!
  end

  private def enforce_guest_found
    guest_id = params.get(:guest_id).to_i64
    @_guest = guest_query.find(guest_id)
    continue
  rescue Avram::RecordNotFoundError
    flash.failure = r("guests.not_found").t
    redirect to: Me::Show
  end
end
