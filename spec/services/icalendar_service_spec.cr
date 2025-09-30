require "../spec_helper"

describe ICalendarService do
  describe ".generate_ical" do
    it "returns empty string for event without start date" do
      setup = create_event_with_organizer
      ical = ICalendarService.generate_ical(setup[:event])
      ical.should be_empty
    end

    it "generates valid iCal format" do
      setup = create_upcoming_event(7)
      ical = ICalendarService.generate_ical(setup[:event])

      ical.should contain("BEGIN:VCALENDAR")
      ical.should contain("END:VCALENDAR")
      ical.should contain("BEGIN:VEVENT")
      ical.should contain("END:VEVENT")
      ical.should contain("VERSION:2.0")
    end

    it "includes event name in SUMMARY" do
      setup = create_upcoming_event(5)
      ical = ICalendarService.generate_ical(setup[:event])

      ical.should contain("SUMMARY:#{setup[:event].name}")
    end

    it "includes start date" do
      setup = create_upcoming_event(3)
      ical = ICalendarService.generate_ical(setup[:event])

      ical.should contain("DTSTART:")
    end

    it "includes location when present" do
      setup = create_upcoming_event(7)
      ical = ICalendarService.generate_ical(setup[:event])

      ical.should contain("LOCATION:")
      ical.should contain(setup[:location].name)
    end

    it "includes organizer name" do
      setup = create_upcoming_event(10)
      ical = ICalendarService.generate_ical(setup[:event])

      ical.should contain("ORGANIZER:")
      ical.should contain(setup[:organizer].name)
    end

    it "includes description when present" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
        .description("Family BBQ celebration")
        .start_at(Time.utc + 5.days)

      event = EventQuery.new.preload_creator.find(event.id)
      ical = ICalendarService.generate_ical(event)

      ical.should contain("DESCRIPTION:")
      ical.should contain("Family BBQ")
    end

    it "uses 2-hour default duration when end_at is missing" do
      organizer = UserFactory.create
      start_time = Time.utc + 7.days
      event = EventFactory.create &.creator_id(organizer.id).start_at(start_time)

      event = EventQuery.new.preload_creator.find(event.id)
      ical = ICalendarService.generate_ical(event)

      ical.should contain("DTSTART:")
      ical.should contain("DTEND:")
    end

    it "escapes special characters" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
        .name("Event; with, special\\chars")
        .start_at(Time.utc + 3.days)

      event = EventQuery.new.preload_creator.find(event.id)
      ical = ICalendarService.generate_ical(event)

      ical.should contain("\\;")
      ical.should contain("\\,")
      ical.should contain("\\\\")
    end
  end
end
