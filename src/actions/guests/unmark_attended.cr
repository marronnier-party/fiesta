class Guests::UnmarkAttended < BrowserAction
  include Auth::RequireSignIn

  post "/guests/:guest_id/unmark_attended" do
    guest = GuestQuery.new.preload_event.find(guest_id)
    event = guest.event!

    # Only the organizer can unmark attendance
    unless event.creator_id == current_user.id
      flash.failure = r("events.errors.not_organizer").t
      redirect to: Events::Show.with(event.id)
    end

    SaveGuest.update!(guest, status: Guest::Status::Confirmed)

    flash.success = r("guests.unmarked_attended").t(name: guest.user!.name)
    redirect to: Events::Show.with(event.id)
  end
end
