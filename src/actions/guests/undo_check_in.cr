class Guests::UndoCheckIn < BrowserAction
  post "/guests/:guest_id/undo_checkin" do
    guest = GuestQuery.new
      .preload_event
      .find(guest_id)

    event = guest.event!

    # Only allow organizer to undo check-in
    unless event.creator_id == current_user.id
      flash.failure = r("errors.unauthorized").t
      redirect to: Events::Show.with(event.id)
    end

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
