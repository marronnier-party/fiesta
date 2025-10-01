require "../spec_helper"

describe "Event management flow", tags: "flow" do
  it "allows organizer to create a draft event" do
    user = UserFactory.create
    flow = EventFlow.new(user)

    flow.create_event("Summer BBQ", "Annual family barbecue")
    flow.should_see_event("Summer BBQ")
    flow.should_see_draft_status
  end

  it "allows organizer to add location to event" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id)
    event = EventFactory.create &.creator_id(user.id).status(Event::Status::Draft)

    flow = EventFlow.new(user)
    flow.update_event_with_location(event, location)

    event = EventQuery.find(event.id)
    event.location_id.should eq location.id
  end

  it "allows organizer to publish event" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id)
    event = EventFactory.create &.creator_id(user.id)
      .status(Event::Status::Draft)
      .location_id(location.id)
      .start_at(1.week.from_now)

    flow = EventFlow.new(user)
    flow.publish_event(event)
    flow.should_see_confirmed_status

    event = EventQuery.find(event.id)
    event.status.should eq Event::Status::Confirmed
  end

  it "complete event creation workflow: draft -> add location -> add guests -> publish" do
    organizer = UserFactory.create
    location = LocationFactory.create &.creator_id(organizer.id)
    guest_user = UserFactory.create

    flow = EventFlow.new(organizer)

    # Create draft event
    flow.create_event("New Year Party", "Ring in the new year together!")
    flow.should_see_draft_status

    event = EventQuery.new.creator_id(organizer.id).name("New Year Party").first

    # Add location
    flow.update_event_with_location(event, location)

    # Add guest
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id)

    # Publish event
    SaveEvent.update!(event, start_at: 1.week.from_now)
    flow.publish_event(event)
    flow.should_see_confirmed_status

    event = EventQuery.find(event.id)
    event.status.should eq Event::Status::Confirmed
    event.location_id.should eq location.id
    event.guests.size.should eq 1
  end

  it "prevents publishing event without future start date" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id)
    event = EventFactory.create &.creator_id(user.id)
      .status(Event::Status::Draft)
      .location_id(location.id)
      .start_at(1.day.ago)

    flow = EventFlow.new(user)
    flow.publish_event(event)

    event = EventQuery.find(event.id)
    event.status.should eq Event::Status::Draft
  end

  it "allows organizer to manage event budget" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id).budget(500.0)

    flow = EventFlow.new(user)
    flow.visit Events::Show.with(event.id), as: user

    flow.should have_element("body", text: "500")

    event.remaining_budget.should eq 500.0
  end

  it "allows organizer to add organizer notes" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)

    flow = EventFlow.new(user)
    flow.visit Events::Edit.with(event.id), as: user
    flow.fill "organizer_notes", "Remember to buy extra ice"
    flow.click "@update-event-button"

    event = EventQuery.find(event.id)
    event.organizer_notes.should eq "Remember to buy extra ice"
  end
end
