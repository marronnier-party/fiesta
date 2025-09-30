require "../spec_helper"

describe SaveEvent do
  it "requires name" do
    user = UserFactory.create
    SaveEvent.create(creator_id: user.id) do |operation, event|
      event.should be_nil
      operation.name.errors.should contain("is required")
    end
  end

  it "allows events with the same name for different creators" do
    user1 = UserFactory.create
    user2 = UserFactory.create

    event1 = SaveEvent.create!(creator_id: user1.id, name: "Birthday Party")
    event2 = SaveEvent.create!(creator_id: user2.id, name: "Birthday Party")

    event1.name.should eq "Birthday Party"
    event2.name.should eq "Birthday Party"
    event1.id.should_not eq event2.id
  end

  it "prevents end date before start date" do
    user = UserFactory.create
    start_time = Time.utc + 1.day
    end_time = start_time - 2.hours

    SaveEvent.create(
      creator_id: user.id,
      name: "Test Event",
      start_at: start_time,
      end_at: end_time
    ) do |operation, event|
      event.should be_nil
      operation.end_at.errors.should contain("must be after start date")
    end
  end

  it "prevents past dates for confirmed events" do
    user = UserFactory.create
    past_time = Time.utc - 1.day

    SaveEvent.create(
      creator_id: user.id,
      name: "Test Event",
      status: Event::Status::Confirmed,
      start_at: past_time
    ) do |operation, event|
      event.should be_nil
      operation.start_at.errors.should contain("must be in the future for confirmed events")
    end
  end

  it "allows past dates for draft events" do
    user = UserFactory.create
    past_time = Time.utc - 1.day

    event = SaveEvent.create!(
      creator_id: user.id,
      name: "Test Event",
      status: Event::Status::Draft,
      start_at: past_time
    )

    event.should_not be_nil
    event.start_at.should eq past_time
  end

  it "generates unique slugs per creator" do
    user = UserFactory.create
    event1 = SaveEvent.create!(creator_id: user.id, name: "My Event")
    event2 = SaveEvent.create!(creator_id: user.id, name: "My Event 2")

    event1.slug.should eq "my-event"
    event2.slug.should eq "my-event-2"
  end
end