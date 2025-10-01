require "./spec_helper"

describe "Direct page render test" do
  it "renders the RSVP page" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id)
    event = EventFactory.create &.status(Event::Status::Confirmed).location_id(location.id).start_at(1.week.from_now)
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)

    # Load with preloads
    loaded_guest = GuestQuery.new
      .id(guest.id)
      .preload_event(EventQuery.new.preload_location)
      .first

    puts "\nGuest ID: #{loaded_guest.id}"
    puts "Event: #{loaded_guest.event!.name}"
    puts "Location: #{loaded_guest.event!.location.try(&.name) || "none"}"
    puts "User ID: #{loaded_guest.user_id}"
    
    # Success if we got here
    loaded_guest.id.should eq guest.id
  end
end
