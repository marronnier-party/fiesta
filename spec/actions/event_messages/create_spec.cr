require "../../spec_helper"

describe EventMessages::Create do
  it "creates message for organizer" do
    setup = create_event_with_organizer

    response = ApiClient.auth(setup[:organizer]).exec(
      EventMessages::Create.with(setup[:event].id),
      body: "content=Hello%20everyone"
    )

    response.status.should eq(302)

    messages = EventMessageQuery.new.for_event(setup[:event]).results
    messages.size.should eq(1)
    messages.first.content.should eq("Hello everyone")
  end

  it "creates message for confirmed guest" do
    setup = create_event_with_guests(1)
    guest = setup[:guests].first

    response = ApiClient.auth(guest.user!).exec(
      EventMessages::Create.with(setup[:event].id),
      body: "content=Thanks%20for%20organizing"
    )

    response.status.should eq(302)

    messages = EventMessageQuery.new.for_event(setup[:event]).results
    messages.size.should eq(1)
  end

  it "denies access to non-participants" do
    setup = create_event_with_organizer
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      EventMessages::Create.with(setup[:event].id),
      body: "content=Test"
    )

    response.status.should eq(302)

    messages = EventMessageQuery.new.for_event(setup[:event]).results
    messages.size.should eq(0)
  end

  it "associates message with correct user" do
    setup = create_event_with_organizer

    ApiClient.auth(setup[:organizer]).exec(
      EventMessages::Create.with(setup[:event].id),
      body: "content=My%20message"
    )

    message = EventMessageQuery.new.for_event(setup[:event]).first
    message.user_id.should eq(setup[:organizer].id)
  end
end
