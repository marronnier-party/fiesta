require "../../spec_helper"

describe Guests::CheckIn do
  it "marks guest as attended" do
    setup = create_event_with_guests(2)
    guest = setup[:guests].first

    response = ApiClient.auth(setup[:organizer]).exec(
      Guests::CheckIn.with(guest.id)
    )

    response.status.should eq(302)

    updated_guest = GuestQuery.find(guest.id)
    updated_guest.status.should eq(Guest::Status::Attended)
  end

  it "denies access to non-organizer" do
    setup = create_event_with_guests(2)
    guest = setup[:guests].first
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      Guests::CheckIn.with(guest.id)
    )

    response.status.should eq(302)

    updated_guest = GuestQuery.find(guest.id)
    updated_guest.status.should_not eq(Guest::Status::Attended)
  end

  it "allows checking in already attended guest" do
    setup = create_event_with_guests(1)
    guest = setup[:guests].first
    SaveGuest.update!(guest, status: Guest::Status::Attended)

    response = ApiClient.auth(setup[:organizer]).exec(
      Guests::CheckIn.with(guest.id)
    )

    response.status.should eq(302)
  end
end
