require "../spec_helper"

describe "Guest invitation flow", tags: "flow" do
  it "allows organizer to invite a guest to event" do
    organizer = UserFactory.create
    guest_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).status(Event::Status::Confirmed)

    flow = EventFlow.new(organizer)
    flow.visit Events::InviteGuests.with(event.id), as: organizer

    flow.fill "@guest-email", guest_user.email
    flow.click "@send-invitation-button"

    GuestQuery.new.user_id(guest_user.id).event_id(event.id).select_count.should eq 1
  end

  it "allows organizer to invite multiple guests" do
    organizer = UserFactory.create
    guest1 = UserFactory.create
    guest2 = UserFactory.create
    guest3 = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).status(Event::Status::Confirmed)

    GuestFactory.create &.user_id(guest1.id).event_id(event.id)
    GuestFactory.create &.user_id(guest2.id).event_id(event.id)
    GuestFactory.create &.user_id(guest3.id).event_id(event.id)

    GuestQuery.new.event_id(event.id).select_count.should eq 3
  end

  it "allows organizer to view guest list" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    confirmed_guest = UserFactory.create
    GuestFactory.create &.user_id(confirmed_guest.id).event_id(event.id).status(Guest::Status::Confirmed)

    pending_guest = UserFactory.create
    GuestFactory.create &.user_id(pending_guest.id).event_id(event.id).status(Guest::Status::NoAnswer)

    declined_guest = UserFactory.create
    GuestFactory.create &.user_id(declined_guest.id).event_id(event.id).status(Guest::Status::Declined)

    flow = EventFlow.new(organizer)
    flow.visit Guests::Index, as: organizer

    flow.should have_element("body", text: confirmed_guest.email)
    flow.should have_element("body", text: pending_guest.email)
    flow.should have_element("body", text: declined_guest.email)
  end

  it "shows organizer RSVP statistics" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    # 3 confirmed guests
    3.times do
      guest_user = UserFactory.create
      GuestFactory.create &.user_id(guest_user.id).event_id(event.id).status(Guest::Status::Confirmed)
    end

    # 2 pending guests
    2.times do
      guest_user = UserFactory.create
      GuestFactory.create &.user_id(guest_user.id).event_id(event.id).status(Guest::Status::NoAnswer)
    end

    # 1 declined guest
    guest_user = UserFactory.create
    GuestFactory.create &.user_id(guest_user.id).event_id(event.id).status(Guest::Status::Declined)

    GuestQuery.new.event_id(event.id).status(Guest::Status::Confirmed).select_count.should eq 3
    GuestQuery.new.event_id(event.id).status(Guest::Status::NoAnswer).select_count.should eq 2
    GuestQuery.new.event_id(event.id).status(Guest::Status::Declined).select_count.should eq 1
  end

  it "allows organizer to remove guest from event" do
    organizer = UserFactory.create
    guest_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id)

    flow = EventFlow.new(organizer)
    flow.visit Guests::Delete.with(guest.id), as: organizer

    GuestQuery.new.id(guest.id).first?.should be_nil
  end

  it "complete invitation workflow: create event -> invite guests -> track RSVPs" do
    organizer = UserFactory.create
    location = LocationFactory.create &.creator_id(organizer.id)

    # Create and publish event
    event = EventFactory.create &.creator_id(organizer.id)
      .status(Event::Status::Confirmed)
      .location_id(location.id)
      .start_at(2.weeks.from_now)

    # Invite guests
    guest1 = UserFactory.create
    guest2 = UserFactory.create
    guest3 = UserFactory.create

    GuestFactory.create &.user_id(guest1.id).event_id(event.id)
    GuestFactory.create &.user_id(guest2.id).event_id(event.id)
    GuestFactory.create &.user_id(guest3.id).event_id(event.id)

    # Guests respond
    guest1_record = GuestQuery.new.user_id(guest1.id).event_id(event.id).first
    SaveGuest.update!(guest1_record, status: Guest::Status::Confirmed)

    guest2_record = GuestQuery.new.user_id(guest2.id).event_id(event.id).first
    SaveGuest.update!(guest2_record, status: Guest::Status::Confirmed)

    guest3_record = GuestQuery.new.user_id(guest3.id).event_id(event.id).first
    SaveGuest.update!(guest3_record, status: Guest::Status::Declined)

    # Verify results
    GuestQuery.new.event_id(event.id).select_count.should eq 3
    GuestQuery.new.event_id(event.id).status(Guest::Status::Confirmed).select_count.should eq 2
    GuestQuery.new.event_id(event.id).status(Guest::Status::Declined).select_count.should eq 1
  end
end
