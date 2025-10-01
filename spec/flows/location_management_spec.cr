require "../spec_helper"

describe "Location management flow", tags: "flow" do
  it "allows user to create a location" do
    user = UserFactory.create
    flow = LocationFlow.new(user)

    flow.create_location("Grandma's House", "123 Main St, Springfield")
    flow.should_see_location("Grandma's House")
    flow.should_see_address("123 Main St, Springfield")
  end

  it "allows user to update location details" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id).name("Old Name")

    flow = LocationFlow.new(user)
    flow.update_location(location, "New Name")

    location.reload
    location.name.should eq "New Name"
  end

  it "allows user to create location with full address details" do
    user = UserFactory.create

    location = LocationFactory.create &.creator_id(user.id)
      .name("Community Center")
      .address("456 Oak Avenue")
      .city("Springfield")
      .country("USA")
      .postal_code("12345")

    location.name.should eq "Community Center"
    location.address.should eq "456 Oak Avenue"
    location.city.should eq "Springfield"
    location.country.should eq "USA"
    location.postal_code.should eq "12345"
  end

  it "allows user to add geographic coordinates to location" do
    user = UserFactory.create

    location = LocationFactory.create &.creator_id(user.id)
      .name("Park")
      .latitude(42.3601)
      .longitude(-71.0589)

    location.latitude.should eq 42.3601
    location.longitude.should eq -71.0589
  end

  it "allows user to view all their locations" do
    user = UserFactory.create

    LocationFactory.create &.creator_id(user.id).name("Location 1")
    LocationFactory.create &.creator_id(user.id).name("Location 2")
    LocationFactory.create &.creator_id(user.id).name("Location 3")

    flow = LocationFlow.new(user)
    flow.visit Locations::Index, as: user

    flow.should have_element("body", text: "Location 1")
    flow.should have_element("body", text: "Location 2")
    flow.should have_element("body", text: "Location 3")
  end

  it "allows user to delete a location" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id)

    flow = LocationFlow.new(user)
    flow.visit Locations::Delete.with(location.id), as: user

    LocationQuery.new.id(location.id).first?.should be_nil
  end

  it "allows user to reuse location for multiple events" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id)

    event1 = EventFactory.create &.creator_id(user.id).location_id(location.id)
    event2 = EventFactory.create &.creator_id(user.id).location_id(location.id)
    event3 = EventFactory.create &.creator_id(user.id).location_id(location.id)

    EventQuery.new.location_id(location.id).select_count.should eq 3
  end

  it "complete location workflow: create -> use in event -> update details" do
    user = UserFactory.create
    flow = LocationFlow.new(user)

    # Create location
    flow.create_location("Beach House", "789 Ocean Drive")
    flow.should_see_location("Beach House")

    location = LocationQuery.new.creator_id(user.id).name("Beach House").first

    # Use in event
    event = EventFactory.create &.creator_id(user.id).location_id(location.id)
    event.location_id.should eq location.id

    # Update location details
    flow.update_location(location, "Seaside Beach House")

    location.reload
    location.name.should eq "Seaside Beach House"

    # Event still references updated location
    event.reload
    event.location_id.should eq location.id
  end

  it "generates unique slugs for locations" do
    user = UserFactory.create

    location1 = LocationFactory.create &.creator_id(user.id).name("Family Home")
    location2 = LocationFactory.create &.creator_id(user.id).name("Family Home")

    location1.slug.should_not eq location2.slug
    location1.slug.should contain "family-home"
    location2.slug.should contain "family-home"
  end
end
