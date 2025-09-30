require "../../spec_helper"

describe Events::Show do
  it "shows event details to organizer" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).name("Test Event")

    response = ApiClient.auth(organizer).exec(Events::Show.with(event.id))

    response.status.should eq(200)
    response.body.should contain(event.name)
    response.body.should contain("Inviter des personnes") # Invite button in French
    response.body.should contain("Ajouter une tâche") # Add task button
  end

  it "shows event details to invited guest" do
    organizer = UserFactory.create
    guest_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest = GuestFactory.create &.event_id(event.id).user_id(guest_user.id).status(Guest::Status::Confirmed)

    response = ApiClient.auth(guest_user).exec(Events::Show.with(event.id))

    response.status.should eq(200)
    response.body.should contain(event.name)
    response.body.should_not contain("Inviter des personnes") # No invite button for guests
  end

  it "shows RSVP button for pending invitations" do
    organizer = UserFactory.create
    guest_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest = GuestFactory.create &.event_id(event.id).user_id(guest_user.id).status(Guest::Status::NoAnswer)

    response = ApiClient.auth(guest_user).exec(Events::Show.with(event.id))

    response.body.should contain("Répondre maintenant") # RSVP Now button
  end

  it "shows guest list with counts" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    3.times do
      user = UserFactory.create
      GuestFactory.create &.event_id(event.id).user_id(user.id).status(Guest::Status::Confirmed)
    end

    2.times do
      user = UserFactory.create
      GuestFactory.create &.event_id(event.id).user_id(user.id).status(Guest::Status::NoAnswer)
    end

    response = ApiClient.auth(organizer).exec(Events::Show.with(event.id))

    response.body.should contain("3") # Confirmed count
    response.body.should contain("2") # Pending count
  end

  it "shows tasks for event" do
    organizer = UserFactory.create
    guest_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest = GuestFactory.create &.event_id(event.id).user_id(guest_user.id)
    task = TaskFactory.create &.event_id(event.id).guest_id(guest.id).name("Bring dessert")

    response = ApiClient.auth(organizer).exec(Events::Show.with(event.id))

    response.body.should contain(task.name)
  end

  it "requires authentication" do
    event = EventFactory.create

    response = ApiClient.exec(Events::Show.with(event.id))

    response.status.should eq(302)
  end

  it "returns 404 for non-existent event" do
    user = UserFactory.create

    expect_raises(Avram::RecordNotFoundError) do
      ApiClient.auth(user).exec(Events::Show.with(999999_i64))
    end
  end
end
