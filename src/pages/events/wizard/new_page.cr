class Events::Wizard::NewPage < MainLayout
  needs current_step : Int32
  needs event : Event?
  needs location : Location?
  needs current_user : User

  def content
    # You might want to add a page title or other elements here
    mount Events::Wizard::Creation,
      current_step: current_step,
      event: event,
      location: location,
      current_user: current_user
  end

  def page_title
    "Create New Event"
  end
end
