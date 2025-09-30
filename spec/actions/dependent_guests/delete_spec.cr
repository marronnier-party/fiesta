require "../../spec_helper"

describe DependentGuests::Delete do
  it "deletes a dependent guest" do
    user = UserFactory.create
    event = EventFactory.create
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)
    dep_guest = DependentGuestFactory.create &.guest_id(guest.id)

    response = ApiClient.auth(user).exec(
      DependentGuests::Delete.with(guest.id, dep_guest.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/guests/#{guest.id}/dependent_guests")

    DependentGuestQuery.new.id(dep_guest.id).first?.should be_nil
  end

  it "prevents deleting from other user's guests" do
    user = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create
    guest = GuestFactory.create &.user_id(other_user.id).event_id(event.id)
    dep_guest = DependentGuestFactory.create &.guest_id(guest.id)

    response = ApiClient.auth(user).exec(
      DependentGuests::Delete.with(guest.id, dep_guest.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/me")

    # Dependent guest should still exist
    DependentGuestQuery.new.id(dep_guest.id).first?.should_not be_nil
  end

  it "requires authentication" do
    guest = GuestFactory.create
    dep_guest = DependentGuestFactory.create &.guest_id(guest.id)

    response = ApiClient.exec(DependentGuests::Delete.with(guest.id, dep_guest.id))

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
