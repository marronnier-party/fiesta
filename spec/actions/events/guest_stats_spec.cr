require "../../spec_helper"

describe Events::GuestStats do
  it "returns guest statistics via htmx" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)

    # Create guests with different statuses
    GuestFactory.create &.event_id(event.id).user_id(user.id).status(:confirmed)
    other_user = UserFactory.create
    GuestFactory.create &.event_id(event.id).user_id(other_user.id).status(:confirmed)

    another_user = UserFactory.create
    GuestFactory.create &.event_id(event.id).user_id(another_user.id).status(:no_answer)

    response = ApiClient.auth(user)
      .headers({"HX-Request" => "true"})
      .exec(Events::GuestStats.with(event.id))

    response.status.should eq(200)

    # Check response contains stats widget with correct counts
    response.body.should contain("2") # confirmed count
    response.body.should contain("1") # pending count
  end

  it "returns 403 for unauthorized users" do
    organizer = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    response = ApiClient.auth(other_user)
      .headers({"HX-Request" => "true"})
      .exec(Events::GuestStats.with(event.id))

    response.status.should eq(403)
  end

  it "allows guests to view stats" do
    organizer = UserFactory.create
    guest_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    GuestFactory.create &.event_id(event.id).user_id(guest_user.id)

    response = ApiClient.auth(guest_user)
      .headers({"HX-Request" => "true"})
      .exec(Events::GuestStats.with(event.id))

    response.status.should eq(200)
  end

  it "returns 404 for non-htmx requests" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)

    response = ApiClient.auth(user)
      .exec(Events::GuestStats.with(event.id))

    response.status.should eq(404)
  end
end
