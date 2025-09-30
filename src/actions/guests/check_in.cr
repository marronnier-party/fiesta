class Guests::CheckIn < BrowserAction
  post "/guests/:guest_id/checkin" do
    guest = GuestQuery.new
      .preload_event
      .find(guest_id)

    event = guest.event!

    # Only allow organizer to check in guests
    unless event.creator_id == current_user.id
      flash.failure = r("errors.unauthorized").t
      redirect to: Events::Show.with(event.id)
    end

    SaveGuest.update(guest, status: Guest::Status::Attended) do |operation, updated|
      if updated
        flash.success = r("checkin.checked_in_successfully").t
      else
        flash.failure = r("errors.invalid").t
      end
    end

    redirect to: Events::CheckInMode.with(event.id)
  end
end
