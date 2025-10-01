class LocationFlow < BaseFlow
  private getter user : User

  def initialize(@user : User)
  end

  def create_location(name : String, address : String)
    visit Locations::New, as: user
    fill_form SaveLocation,
      name: name,
      address: address,
      creator_id: user.id
    click "@create-location-button"
  end

  def update_location(location : Location, new_name : String)
    visit Locations::Edit.with(location.id), as: user
    fill "name", new_name
    click "@update-location-button"
  end

  def should_see_location(name : String)
    current_page.should have_element("body", text: name)
  end

  def should_see_address(address : String)
    current_page.should have_element("body", text: address)
  end

  private def current_page
    self
  end
end
