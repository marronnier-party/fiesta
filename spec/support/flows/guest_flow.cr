class GuestFlow < BaseFlow
  private getter user : User
  private getter event : Event

  def initialize(@user : User, @event : Event)
  end

  def rsvp_confirmed
    visit Guests::Rsvp.with(guest.id), as: user
    # Select confirmed radio button
    el("input[name='guest:status'][value='#{Guest::Status::Confirmed.value}']").click
    click "button[type='submit']"
  end

  def rsvp_declined
    visit Guests::Rsvp.with(guest.id), as: user
    # Select declined radio button
    el("input[name='guest:status'][value='#{Guest::Status::Declined.value}']").click
    click "button[type='submit']"
  end

  def add_plus_one
    visit Guests::Rsvp.with(guest.id), as: user
    fill "guest:guest_count", "2"
    click "button[type='submit']"
  end

  def add_notes(notes : String)
    visit Guests::Rsvp.with(guest.id), as: user
    fill "guest:notes", notes
    click "button[type='submit']"
  end

  def should_see_confirmed_status
    current_page.should have_element("body", text: "Confirmed")
  end

  def should_see_declined_status
    current_page.should have_element("body", text: "Declined")
  end

  def should_see_guest_count(count : Int32)
    current_page.should have_element("body", text: count.to_s)
  end

  private def guest
    GuestQuery.new.user_id(user.id).event_id(event.id).first
  end

  private def current_page
    self
  end
end
