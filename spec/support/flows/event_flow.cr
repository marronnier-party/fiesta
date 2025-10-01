class EventFlow < BaseFlow
  private getter user : User

  def initialize(@user : User)
  end

  def create_event(name : String, description : String)
    visit Events::New, as: user
    fill_form SaveEvent,
      name: name,
      description: description,
      status: Event::Status::Draft.to_s
    click "@create-event-button"
  end

  def update_event_with_location(event : Event, location : Location)
    visit Events::Edit.with(event.id), as: user
    fill "location_id", location.id.to_s
    click "@update-event-button"
  end

  def publish_event(event : Event)
    visit Events::Edit.with(event.id), as: user
    fill "status", Event::Status::Confirmed.to_s
    click "@update-event-button"
  end

  def should_see_event(name : String)
    current_page.should have_element("body", text: name)
  end

  def should_see_draft_status
    current_page.should have_element("body", text: "Draft")
  end

  def should_see_confirmed_status
    current_page.should have_element("body", text: "Confirmed")
  end

  private def current_page
    self
  end
end
