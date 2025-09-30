require "../spec_helper"

describe GuestQuery do
  describe "for_event" do
    it "returns guests for specific event" do
      event = EventFactory.create
      guest1 = GuestFactory.create &.event_id(event.id)
      guest2 = GuestFactory.create &.event_id(event.id)
      other_guest = GuestFactory.create

      results = GuestQuery.new.for_event(event).results

      results.should contain(guest1)
      results.should contain(guest2)
      results.should_not contain(other_guest)
    end
  end

  describe "for_user" do
    it "returns invitations for specific user" do
      user = UserFactory.create
      guest1 = GuestFactory.create &.user_id(user.id)
      guest2 = GuestFactory.create &.user_id(user.id)
      other_guest = GuestFactory.create

      results = GuestQuery.new.for_user(user).results

      results.should contain(guest1)
      results.should contain(guest2)
      results.should_not contain(other_guest)
    end
  end

  describe "confirmed" do
    it "returns only confirmed guests" do
      confirmed = GuestFactory.create &.status(Guest::Status::Confirmed)
      no_answer = GuestFactory.create &.status(Guest::Status::NoAnswer)
      declined = GuestFactory.create &.status(Guest::Status::Declined)

      results = GuestQuery.new.confirmed.results

      results.should contain(confirmed)
      results.should_not contain(no_answer)
      results.should_not contain(declined)
    end
  end

  describe "awaiting_response" do
    it "returns guests who haven't responded" do
      no_answer = GuestFactory.create &.status(Guest::Status::NoAnswer)
      confirmed = GuestFactory.create &.status(Guest::Status::Confirmed)
      declined = GuestFactory.create &.status(Guest::Status::Declined)

      results = GuestQuery.new.awaiting_response.results

      results.should contain(no_answer)
      results.should_not contain(confirmed)
      results.should_not contain(declined)
    end
  end

  describe "declined" do
    it "returns only declined guests" do
      declined = GuestFactory.create &.status(Guest::Status::Declined)
      confirmed = GuestFactory.create &.status(Guest::Status::Confirmed)

      results = GuestQuery.new.declined.results

      results.should contain(declined)
      results.should_not contain(confirmed)
    end
  end

  describe "preload_event" do
    it "preloads event with details" do
      event = EventFactory.create &.name("Test Event")
      guest = GuestFactory.create &.event_id(event.id)

      result = GuestQuery.new.preload_event.find(guest.id)

      result.event!.name.should eq("Test Event")
    end

    it "preloads nested event associations" do
      location = LocationFactory.create &.name("Test Location")
      event = EventFactory.create &.location_id(location.id)
      guest = GuestFactory.create &.event_id(event.id)

      event_query = EventQuery.new.preload_location
      result = GuestQuery.new.preload_event(event_query).find(guest.id)

      result.event!.location.should_not be_nil
      result.event!.location.not_nil!.name.should eq("Test Location")
    end
  end

  describe "preload_user" do
    it "preloads user information" do
      user = UserFactory.create &.name("Test User")
      guest = GuestFactory.create &.user_id(user.id)

      result = GuestQuery.new.preload_user.find(guest.id)

      result.user!.name.should eq("Test User")
    end
  end
end
