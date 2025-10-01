require "../../spec_helper"

describe Guests::UpdateStatus do
  it "updates guest status via htmx" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)
    guest = GuestFactory.create &.event_id(event.id).user_id(user.id).status(:no_answer)

    response = ApiClient.auth(user)
      .headers("HX-Request": "true")
      .exec(
        Guests::UpdateStatus.with(guest.id),
        status: "confirmed"
      )

    response.status.should eq(200)
    guest.reload.status.should eq(Guest::Status::Confirmed)

    # Check htmx response contains updated guest row
    response.body.should contain("guest-#{guest.id}")
  end

  it "returns 403 for non-organizers" do
    organizer = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest = GuestFactory.create &.event_id(event.id).user_id(other_user.id)

    response = ApiClient.auth(other_user)
      .headers("HX-Request": "true")
      .exec(
        Guests::UpdateStatus.with(guest.id),
        status: "confirmed"
      )

    response.status.should eq(403)
  end

  it "works without htmx (progressive enhancement)" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)
    guest = GuestFactory.create &.event_id(event.id).user_id(user.id).status(:no_answer)

    response = ApiClient.auth(user)
      .exec(
        Guests::UpdateStatus.with(guest.id),
        status: "confirmed"
      )

    response.status.should eq(302)
    guest.reload.status.should eq(Guest::Status::Confirmed)
  end
end
