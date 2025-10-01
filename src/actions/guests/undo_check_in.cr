class Guests::UndoCheckIn < BrowserAction
  post "/guests/:guest_id/undo_checkin" do
    guest = GuestQuery.new
      .preload_event
      .find(guest_id)

    authorize guest, policy: GuestPolicy, query: :undo_check_in?

    event = guest.event!

    SaveGuest.update(guest, status: Guest::Status::Confirmed) do |operation, updated|
      if updated
        flash.success = "Check-in annulé"
      else
        flash.failure = r("errors.invalid").t
      end
    end

    redirect to: Events::CheckInMode.with(event.id)
  end
end
