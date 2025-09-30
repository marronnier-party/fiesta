require "../../spec_helper"

describe Events::ShowMessages do
  it "shows messages page to organizer" do
    setup = create_event_with_organizer

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ShowMessages.with(setup[:event].id)
    )

    response.status.should eq(200)
    response.body.should contain("Messages")
  end

  it "shows messages page to confirmed guest" do
    setup = create_event_with_guests(1)
    guest = setup[:guests].first

    response = ApiClient.auth(guest.user!).exec(
      Events::ShowMessages.with(setup[:event].id)
    )

    response.status.should eq(200)
  end

  it "displays existing messages" do
    setup = create_event_with_organizer
    EventMessageFactory.create &.event_id(setup[:event].id)
      .user_id(setup[:organizer].id)
      .content("Welcome everyone!")

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ShowMessages.with(setup[:event].id)
    )

    response.body.should contain("Welcome everyone!")
  end

  it "shows message form" do
    setup = create_event_with_organizer

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ShowMessages.with(setup[:event].id)
    )

    response.body.should contain("textarea")
    response.body.should contain("Envoyer un message")
  end

  it "denies access to non-participants" do
    setup = create_event_with_organizer
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      Events::ShowMessages.with(setup[:event].id)
    )

    response.status.should eq(302)
  end

  it "shows empty state when no messages" do
    setup = create_event_with_organizer

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ShowMessages.with(setup[:event].id)
    )

    response.body.should contain("Aucun message")
  end
end
