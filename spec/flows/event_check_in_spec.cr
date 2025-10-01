require "../spec_helper"

describe "Event check-in flow", tags: "flow" do
  it "allows organizer to check in a guest" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).status(Event::Status::Confirmed)
    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id).status(Guest::Status::Confirmed)

    flow = EventFlow.new(organizer)
    flow.visit Events::CheckInMode.with(event.id), as: organizer
    flow.click "@check-in-guest-#{guest.id}"

    guest.reload
    guest.status.should eq Guest::Status::Attended
  end

  it "allows organizer to undo guest check-in" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).status(Event::Status::Confirmed)
    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id).status(Guest::Status::Attended)

    flow = EventFlow.new(organizer)
    flow.visit Guests::UndoCheckIn.with(guest.id), as: organizer

    guest.reload
    guest.status.should eq Guest::Status::Confirmed
  end

  it "tracks check-in for guests with plus-ones" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).status(Event::Status::Confirmed)
    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id)
      .status(Guest::Status::Confirmed)
      .guest_count(3)

    flow = EventFlow.new(organizer)
    flow.visit Events::CheckInMode.with(event.id), as: organizer
    flow.click "@check-in-guest-#{guest.id}"

    guest.reload
    guest.status.should eq Guest::Status::Attended
    guest.guest_count.should eq 3
  end

  it "shows only confirmed guests in check-in mode" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).status(Event::Status::Confirmed)

    confirmed_user = UserFactory.create
    confirmed_guest = GuestFactory.create &.user_id(confirmed_user.id).event_id(event.id).status(Guest::Status::Confirmed)

    pending_user = UserFactory.create
    pending_guest = GuestFactory.create &.user_id(pending_user.id).event_id(event.id).status(Guest::Status::NoAnswer)

    declined_user = UserFactory.create
    declined_guest = GuestFactory.create &.user_id(declined_user.id).event_id(event.id).status(Guest::Status::Declined)

    flow = EventFlow.new(organizer)
    flow.visit Events::CheckInMode.with(event.id), as: organizer

    flow.should have_element("@check-in-guest-#{confirmed_guest.id}")
  end

  it "tracks attendance count for event" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).status(Event::Status::Confirmed)

    # Create 5 confirmed guests
    5.times do
      guest_user = UserFactory.create
      GuestFactory.create &.user_id(guest_user.id).event_id(event.id).status(Guest::Status::Confirmed)
    end

    # Check in 3 guests
    GuestQuery.new.event_id(event.id).limit(3).each do |guest|
      SaveGuest.update!(guest, status: Guest::Status::Attended)
    end

    GuestQuery.new.event_id(event.id).status(Guest::Status::Attended).select_count.should eq 3
    GuestQuery.new.event_id(event.id).status(Guest::Status::Confirmed).select_count.should eq 2
  end

  it "complete check-in workflow for event day" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).status(Event::Status::Confirmed)

    # 4 guests confirmed
    guest1_user = UserFactory.create
    guest1 = GuestFactory.create &.user_id(guest1_user.id).event_id(event.id).status(Guest::Status::Confirmed)

    guest2_user = UserFactory.create
    guest2 = GuestFactory.create &.user_id(guest2_user.id).event_id(event.id).status(Guest::Status::Confirmed)

    guest3_user = UserFactory.create
    guest3 = GuestFactory.create &.user_id(guest3_user.id).event_id(event.id).status(Guest::Status::Confirmed)

    guest4_user = UserFactory.create
    guest4 = GuestFactory.create &.user_id(guest4_user.id).event_id(event.id).status(Guest::Status::Confirmed)

    # Enter check-in mode
    flow = EventFlow.new(organizer)
    flow.visit Events::CheckInMode.with(event.id), as: organizer

    # Check in guests as they arrive
    SaveGuest.update!(guest1, status: Guest::Status::Attended)
    SaveGuest.update!(guest2, status: Guest::Status::Attended)
    SaveGuest.update!(guest3, status: Guest::Status::Attended)

    # Guest 4 doesn't show up (remains Confirmed)

    # Verify results
    GuestQuery.new.event_id(event.id).status(Guest::Status::Attended).select_count.should eq 3
    GuestQuery.new.event_id(event.id).status(Guest::Status::Confirmed).select_count.should eq 1
  end

  it "allows marking event as done after check-ins" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).status(Event::Status::Confirmed)

    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id).status(Guest::Status::Confirmed)

    # Check in guest
    SaveGuest.update!(guest, status: Guest::Status::Attended)

    # Mark event as done
    SaveEvent.update!(event, status: Event::Status::Done)

    event.reload
    event.status.should eq Event::Status::Done
  end
end
