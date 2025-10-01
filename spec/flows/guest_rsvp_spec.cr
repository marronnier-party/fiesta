require "../spec_helper"

describe "Guest RSVP flow", tags: "flow" do
  it "allows guest to confirm attendance" do
    user = UserFactory.create
    event = EventFactory.create &.status(Event::Status::Confirmed)
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)

    flow = GuestFlow.new(user, event)
    flow.rsvp_confirmed
    flow.should_see_confirmed_status

    guest.reload
    guest.status.should eq Guest::Status::Confirmed
  end

  it "allows guest to decline invitation" do
    user = UserFactory.create
    event = EventFactory.create &.status(Event::Status::Confirmed)
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)

    flow = GuestFlow.new(user, event)
    flow.rsvp_declined
    flow.should_see_declined_status

    guest.reload
    guest.status.should eq Guest::Status::Declined
  end

  it "allows guest to add plus ones" do
    user = UserFactory.create
    event = EventFactory.create &.status(Event::Status::Confirmed)
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id).guest_count(1)

    flow = GuestFlow.new(user, event)
    flow.add_plus_one
    flow.should_see_guest_count(2)

    guest.reload
    guest.guest_count.should eq 2
  end

  it "allows guest to add dietary restrictions" do
    user = UserFactory.create
    event = EventFactory.create &.status(Event::Status::Confirmed)
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)

    flow = GuestFlow.new(user, event)
    flow.add_notes("Vegetarian, no nuts")

    guest.reload
    guest.notes.should eq "Vegetarian, no nuts"
  end

  it "complete RSVP workflow: invite -> confirm -> add details" do
    user = UserFactory.create
    event = EventFactory.create &.status(Event::Status::Confirmed)
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)

    flow = GuestFlow.new(user, event)

    # Guest confirms attendance
    flow.rsvp_confirmed
    flow.should_see_confirmed_status

    # Guest adds plus one
    flow.add_plus_one
    flow.should_see_guest_count(2)

    # Guest adds dietary notes
    flow.add_notes("Gluten-free")

    guest.reload
    guest.status.should eq Guest::Status::Confirmed
    guest.guest_count.should eq 2
    guest.notes.should eq "Gluten-free"
  end
end
