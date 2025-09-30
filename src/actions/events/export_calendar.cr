class Events::ExportCalendar < BrowserAction
  get "/events/:event_id/export/calendar" do
    event = EventQuery.new
      .preload_creator
      .preload_location
      .find(event_id)

    # Check if user is invited or is the organizer
    unless event.creator_id == current_user.id
      guest = GuestQuery.new
        .for_event(event)
        .user_id(current_user.id)
        .first?

      unless guest
        flash.failure = r("errors.unauthorized").t
        redirect to: Events::Show.with(event.id)
      end
    end

    # Generate iCal content
    ical_content = ICalendarService.generate_ical(event)

    if ical_content.empty?
      flash.failure = "Cannot export event without a start date"
      redirect to: Events::Show.with(event.id)
    end

    # Return as downloadable file
    response.content_type = "text/calendar; charset=utf-8"
    response.headers["Content-Disposition"] = "attachment; filename=\"#{event.slug}.ics\""

    plain_text ical_content
  end
end
