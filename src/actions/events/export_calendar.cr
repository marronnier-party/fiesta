class Events::ExportCalendar < BrowserAction
  get "/events/:event_id/export/calendar" do
    event = EventQuery.new
      .preload_creator
      .preload_location
      .find(event_id)

    authorize event, policy: EventPolicy, query: :export_calendar?

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
