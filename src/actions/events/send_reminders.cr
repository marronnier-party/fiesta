class Events::SendReminders < BrowserAction
  include Auth::RequireSignIn

  post "/events/:event_id/send_reminders" do
    event = EventQuery.new.preload_creator.find(event_id)

    # Only the organizer can send reminders
    unless event.creator_id == current_user.id
      flash.failure = r("events.errors.not_organizer").t
      redirect to: Events::Show.with(event_id)
    end

    # Find all pending guests
    pending_guests = GuestQuery.new
      .for_event(event)
      .awaiting_response
      .preload_user
      .results

    if pending_guests.empty?
      flash.info = r("events.reminders.no_pending_guests").t
      redirect to: Events::Show.with(event_id)
    end

    # Create activity for sending reminders
    SaveEventActivity.create!(
      event_id: event.id,
      user_id: current_user.id,
      activity_type: "reminder_sent",
      description: r("events.reminders.sent_to_count").t(count: pending_guests.size)
    )

    # TODO: Actually send email reminders when email system is implemented
    # For now, just log the activity

    flash.success = r("events.reminders.sent_success").t(count: pending_guests.size)
    redirect to: Events::Show.with(event_id)
  end
end
