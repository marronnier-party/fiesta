require "../../spec_helper"

describe Events::UpdateField do
  it "updates event name via htmx" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id).name("Old Name")

    response = ApiClient.auth(user)
      .headers("HX-Request": "true")
      .exec(
        Events::UpdateField.with(event.id),
        "event:name": "New Name"
      )

    response.status.should eq(200)
    event.reload.name.should eq("New Name")

    # Check success message header
    response.headers["X-Success-Message"]?.should eq("Event updated")
  end

  it "updates event description via htmx" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id).description("Old Description")

    response = ApiClient.auth(user)
      .headers("HX-Request": "true")
      .exec(
        Events::UpdateField.with(event.id),
        "event:description": "New Description"
      )

    response.status.should eq(200)
    event.reload.description.should eq("New Description")
  end

  it "updates event location via htmx" do
    user = UserFactory.create
    location = LocationFactory.create &.name("Old Location")
    event = EventFactory.create &.creator_id(user.id).location_id(location.id)

    new_location = LocationFactory.create &.name("New Location")

    response = ApiClient.auth(user)
      .headers("HX-Request": "true")
      .exec(
        Events::UpdateField.with(event.id),
        "event:location": new_location.id.to_s
      )

    response.status.should eq(200)
  end

  it "returns 403 for non-organizers" do
    organizer = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).name("Original")

    response = ApiClient.auth(other_user)
      .headers("HX-Request": "true")
      .exec(
        Events::UpdateField.with(event.id),
        "event:name": "Hacked Name"
      )

    response.status.should eq(403)
    event.reload.name.should eq("Original")
  end

  it "works without htmx (progressive enhancement)" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id).name("Old Name")

    response = ApiClient.auth(user)
      .exec(
        Events::UpdateField.with(event.id),
        "event:name": "New Name"
      )

    response.status.should eq(302)
    event.reload.name.should eq("New Name")
  end
end
