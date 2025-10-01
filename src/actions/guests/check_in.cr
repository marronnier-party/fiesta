class Guests::CheckIn < BrowserAction
  include RequireGuestFromId

  private def guest_query
    GuestQuery.new.preload_event
  end

  post "/guests/:guest_id/checkin" do
    authorize guest, policy: GuestPolicy, query: :check_in?

    event = guest.event!

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
