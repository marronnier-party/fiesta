require "../spec_helper"

describe EventQuery do
  describe "for_user" do
    it "returns events created by user" do
      user = UserFactory.create
      event1 = EventFactory.create &.creator_id(user.id)
      event2 = EventFactory.create &.creator_id(user.id)
      other_event = EventFactory.create

      results = EventQuery.new.for_user(user).results

      results.should contain(event1)
      results.should contain(event2)
      results.should_not contain(other_event)
    end
  end

  describe "ordered_by_date" do
    it "orders events by start date ascending" do
      future_event = EventFactory.create &.start_at(Time.utc + 7.days)
      near_event = EventFactory.create &.start_at(Time.utc + 1.day)
      far_event = EventFactory.create &.start_at(Time.utc + 14.days)

      results = EventQuery.new.ordered_by_date.results

      results[0].id.should eq(near_event.id)
      results[1].id.should eq(future_event.id)
      results[2].id.should eq(far_event.id)
    end

    it "handles events without start dates" do
      event_with_date = EventFactory.create &.start_at(Time.utc + 1.day)
      event_without_date = EventFactory.create

      results = EventQuery.new.ordered_by_date.results

      results.size.should eq(2)
      # Events without dates should appear after events with dates
    end
  end


  describe "confirmed" do
    it "returns only confirmed events" do
      confirmed = EventFactory.create &.status(Event::Status::Confirmed)
      draft = EventFactory.create &.status(Event::Status::Draft)
      cancelled = EventFactory.create &.status(Event::Status::Cancelled)

      results = EventQuery.new.confirmed.results

      results.should contain(confirmed)
      results.should_not contain(draft)
      results.should_not contain(cancelled)
    end
  end

  describe "preload associations" do
    it "preloads creator" do
      user = UserFactory.create &.name("Test Creator")
      event = EventFactory.create &.creator_id(user.id)

      result = EventQuery.new.preload_creator.find(event.id)

      result.creator!.name.should eq("Test Creator")
    end

    it "preloads location" do
      location = LocationFactory.create &.name("Test Location")
      event = EventFactory.create &.location_id(location.id)

      result = EventQuery.new.preload_location.find(event.id)

      result.location.should_not be_nil
      result.location.not_nil!.name.should eq("Test Location")
    end
  end
end
