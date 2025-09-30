require "../../spec_helper"

describe DependentGuests::Create do
  it "creates a dependent guest" do
    user = UserFactory.create
    event = EventFactory.create
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)

    response = ApiClient.auth(user).exec(
      DependentGuests::Create.with(guest.id),
      backdoor_user_id: user.id,
      dependent_guest: {
        name: "John Doe",
        age: 10,
        relationship: "Child"
      }
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/guests/#{guest.id}/dependent_guests")

    dep_guest = DependentGuestQuery.new.for_guest(guest).first
    dep_guest.name.should eq("John Doe")
    dep_guest.age.should eq(10)
    dep_guest.relationship.should eq("Child")
  end

  it "prevents creating for other user's guests" do
    user = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create
    guest = GuestFactory.create &.user_id(other_user.id).event_id(event.id)

    response = ApiClient.auth(user).exec(
      DependentGuests::Create.with(guest.id),
      backdoor_user_id: user.id,
      dependent_guest: {name: "Test"}
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/me")
  end

  it "requires authentication" do
    guest = GuestFactory.create

    response = ApiClient.exec(
      DependentGuests::Create.with(guest.id),
      dependent_guest: {name: "Test"}
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
