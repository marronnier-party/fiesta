module SpecHelpers
  # Create a complete event setup with organizer
  def create_event_with_organizer(
    event_name : String = "Test Event",
    organizer_name : String = "Organizer"
  )
    organizer = UserFactory.create &.name(organizer_name)
    event = EventFactory.create &.creator_id(organizer.id).name(event_name)
    {organizer: organizer, event: event}
  end

  # Create event with confirmed guests
  def create_event_with_guests(guest_count : Int32 = 3)
    setup = create_event_with_organizer
    guests = [] of Guest

    guest_count.times do |i|
      user = UserFactory.create &.name("Guest #{i + 1}")
      guest = GuestFactory.create &.event_id(setup[:event].id)
        .user_id(user.id)
        .status(Guest::Status::Confirmed)
      guests << guest
    end

    {organizer: setup[:organizer], event: setup[:event], guests: guests}
  end

  # Create event with location and date
  def create_upcoming_event(days_from_now : Int32 = 7)
    setup = create_event_with_organizer
    location = LocationFactory.create &.creator_id(setup[:organizer].id)

    SaveEvent.update(setup[:event],
      location_id: location.id,
      start_at: Time.utc + days_from_now.days,
      status: Event::Status::Confirmed
    )

    {
      organizer: setup[:organizer],
      event: EventQuery.new.preload_location.find(setup[:event].id),
      location: location,
    }
  end

  # Create Secret Santa setup
  def create_secret_santa_with_participants(participant_count : Int32 = 4)
    setup = create_event_with_guests(participant_count)
    secret_santa = SecretSantaFactory.create &.event_id(setup[:event].id)

    {
      organizer: setup[:organizer],
      event: setup[:event],
      guests: setup[:guests],
      secret_santa: secret_santa,
    }
  end
end

# Include in specs
include SpecHelpers
