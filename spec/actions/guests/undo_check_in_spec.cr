require "../../spec_helper"

describe Guests::UndoCheckIn do
  it "changes attended guest back to confirmed" do
    setup = create_event_with_guests(1)
    guest = setup[:guests].first
    SaveGuest.update!(guest, status: Guest::Status::Attended)

    response = ApiClient.auth(setup[:organizer]).exec(
      Guests::UndoCheckIn.with(guest.id)
    )

    response.status.should eq(302)

    updated_guest = GuestQuery.find(guest.id)
    updated_guest.status.should eq(Guest::Status::Confirmed)
  end

  it "denies access to non-organizer" do
    setup = create_event_with_guests(1)
    guest = setup[:guests].first
    SaveGuest.update!(guest, status: Guest::Status::Attended)
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      Guests::UndoCheckIn.with(guest.id)
    )

    response.status.should eq(302)

    updated_guest = GuestQuery.find(guest.id)
    updated_guest.status.should eq(Guest::Status::Attended)
  end
end
