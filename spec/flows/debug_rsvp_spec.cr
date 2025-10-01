require "../spec_helper"

describe "Debug RSVP", tags: "flow" do
  it "shows what's on the RSVP page" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id)
    event = EventFactory.create &.status(Event::Status::Confirmed).location_id(location.id).start_at(1.week.from_now)
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)

    flow = BaseFlow.new
    flow.visit Guests::Rsvp.with(guest.id), as: user

    # Check URL
    puts "\n\n=== CURRENT URL ==="
    puts flow.current_path
    puts "===================\n\n"

    # Check for flash messages
    begin
      alert = flow.el(".alert")
      puts "⚠ Alert found - there might be an error!"
    rescue
      puts "No alert element"
    end

    # Check for form
    begin
      flow.el("form")
      puts "✓ Form found!"
    rescue
      puts "✗ Form not found!"

      # Maybe check for a specific error?
      begin
        flash_elem = flow.el("[role='alert']")
        puts "Found alert role element"
      rescue
        puts "No alert role element"
      end
    end
  end
end
