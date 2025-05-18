class Events::Wizard::NewPage < MainLayout
  needs current_step : Int32
  needs event : Event?
  needs location : Location?

  def content
    # You might want to add a page title or other elements here
    mount Events::Wizard::Creation::Container,
      current_step: current_step,
      event: event,
      location: location,
      current_user: current_user
  end

  def page_title
    "Create New Event"
  end
end
