class LocationFactory < Avram::Factory
  def initialize
    name "Home #{sequence("location-name")}"
    slug "home-#{sequence("location-slug")}"
    description "Family home"
    address "123 Main St"
    city "Springfield"
    country "USA"
    postal_code "12345"
    creator_id UserFactory.create.id
  end
end