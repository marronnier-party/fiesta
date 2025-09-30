class Guests::MarkAttended < BrowserAction
  include Auth::RequireSignIn

  post "/guests/:guest_id/mark_attended" do
    guest = GuestQuery.new.preload_event.find(guest_id)
    event = guest.event!

    # Only the organizer can mark attendance
    unless event.creator_id == current_user.id
      flash.failure = r("events.errors.not_organizer").t
      redirect to: Events::Show.with(event.id)
    end

    # Only confirmed guests can be marked as attended
    unless guest.status == Guest::Status::Confirmed
      flash.failure = r("guests.errors.must_be_confirmed").t
      redirect to: Events::Show.with(event.id)
    end

    SaveGuest.update!(guest, status: Guest::Status::Attended)

    # Create activity
    SaveEventActivity.create!(
      event_id: event.id,
      user_id: current_user.id,
      activity_type: "guest_attended",
      description: r("guests.attended_activity").t(name: guest.user!.name)
    )

    flash.success = r("guests.marked_attended").t(name: guest.user!.name)
    redirect to: Events::Show.with(event.id)
  end
end
