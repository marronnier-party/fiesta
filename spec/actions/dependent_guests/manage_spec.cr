require "../../spec_helper"

describe DependentGuests::Manage do
  it "shows manage page for own guest record" do
    user = UserFactory.create
    event = EventFactory.create
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)
    dependent = DependentGuestFactory.create &.guest_id(guest.id).name("Jane Doe")

    response = ApiClient.auth(user).exec(
      DependentGuests::Manage.with(guest.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::OK)
    response.body.should contain("Jane Doe")
  end

  it "prevents managing other user's guests" do
    user = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create
    guest = GuestFactory.create &.user_id(other_user.id).event_id(event.id)

    response = ApiClient.auth(user).exec(
      DependentGuests::Manage.with(guest.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/me")
  end

  it "requires authentication" do
    guest = GuestFactory.create

    response = ApiClient.exec(DependentGuests::Manage.with(guest.id))

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
