class Locations::Wizard::NewPage < MainLayout
  needs current_step : Int32
  needs parent_event : Event?
  needs location : Location?

  def content
    # You might want to add a page title or other elements here
    mount Locations::Wizard::Container,
      current_step: current_step,
      parent_event: parent_event,
      location: location,
      current_user: current_user
  end

  def page_title
    "Create New Location"
  end
end
