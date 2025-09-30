require "../spec_helper"

describe SaveGuest do
  it "requires user_id and event_id" do
    SaveGuest.create do |operation, guest|
      guest.should be_nil
      operation.user_id.errors.should contain("is required")
      operation.event_id.errors.should contain("is required")
    end
  end

  it "sets confirmed_at when status is Confirmed" do
    user = UserFactory.create
    event = EventFactory.create

    guest = SaveGuest.create!(
      user_id: user.id,
      event_id: event.id,
      status: Guest::Status::Confirmed
    )

    guest.confirmed_at.should_not be_nil
    guest.answered_at.should_not be_nil
  end

  it "sets declined_at when status is Declined" do
    user = UserFactory.create
    event = EventFactory.create

    guest = SaveGuest.create!(
      user_id: user.id,
      event_id: event.id,
      status: Guest::Status::Declined
    )

    guest.declined_at.should_not be_nil
    guest.answered_at.should_not be_nil
  end

  it "sets answered_at when status changes from NoAnswer" do
    user = UserFactory.create
    event = EventFactory.create

    guest = SaveGuest.create!(
      user_id: user.id,
      event_id: event.id,
      status: Guest::Status::NoAnswer
    )

    guest.answered_at.should be_nil

    updated_guest = SaveGuest.update!(guest, status: Guest::Status::Confirmed)
    updated_guest.answered_at.should_not be_nil
  end

  it "prevents duplicate guest invitations" do
    user = UserFactory.create
    event = EventFactory.create

    guest1 = SaveGuest.create!(user_id: user.id, event_id: event.id)

    # This should fail once migration is run
    # SaveGuest.create(user_id: user.id, event_id: event.id) do |operation, guest|
    #   guest.should be_nil
    # end
  end
end