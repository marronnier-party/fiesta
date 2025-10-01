class Guests::UndoCheckIn < BrowserAction
  include RequireGuestFromId

  private def guest_query
    GuestQuery.new.preload_event
  end

  post "/guests/:guest_id/undo_checkin" do
    authorize guest, policy: GuestPolicy, query: :undo_check_in?

    event = guest.event!

    SaveGuest.update(guest, status: Guest::Status::Confirmed) do |operation, updated|
      if updated
        flash.success = r("checkin.undone_successfully").t
      else
        flash.failure = r("errors.invalid").t
      end
    end

    redirect to: Events::CheckInMode.with(event.id)
  end
end
