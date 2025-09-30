class ICalendarService
  def self.generate_ical(event : Event) : String
    return "" unless start_at = event.start_at

    # Generate unique UID
    uid = "fiesta-event-#{event.id}@fiesta.app"

    # Format dates for iCal (YYYYMMDDTHHMMSS)
    dtstart = start_at.to_s("%Y%m%dT%H%M%S")
    dtend = if end_at = event.end_at
              end_at.to_s("%Y%m%dT%H%M%S")
            else
              # Default to 2 hours after start
              (start_at + 2.hours).to_s("%Y%m%dT%H%M%S")
            end

    dtstamp = Time.utc.to_s("%Y%m%dT%H%M%S")

    # Build location string
    location = if loc = event.location
                 parts = [loc.name]
                 if addr = loc.address
                   parts << addr
                 end
                 if city = loc.city
                   parts << city
                 end
                 parts.join(", ")
               else
                 ""
               end

    # Build description
    description = event.description || ""

    # Generate iCal format
    ical = String.build do |str|
      str << "BEGIN:VCALENDAR\r\n"
      str << "VERSION:2.0\r\n"
      str << "PRODID:-//Fiesta//Event Organizer//EN\r\n"
      str << "METHOD:PUBLISH\r\n"
      str << "BEGIN:VEVENT\r\n"
      str << "UID:#{uid}\r\n"
      str << "DTSTAMP:#{dtstamp}Z\r\n"
      str << "DTSTART:#{dtstart}Z\r\n"
      str << "DTEND:#{dtend}Z\r\n"
      str << "SUMMARY:#{escape_ical_text(event.name)}\r\n"
      str << "DESCRIPTION:#{escape_ical_text(description)}\r\n" unless description.empty?
      str << "LOCATION:#{escape_ical_text(location)}\r\n" unless location.empty?
      str << "ORGANIZER:CN=#{escape_ical_text(event.creator!.name)}\r\n"
      str << "STATUS:CONFIRMED\r\n"
      str << "END:VEVENT\r\n"
      str << "END:VCALENDAR\r\n"
    end

    ical
  end

  private def self.escape_ical_text(text : String) : String
    text.gsub("\\", "\\\\")
        .gsub(",", "\\,")
        .gsub(";", "\\;")
        .gsub("\n", "\\n")
  end
end
