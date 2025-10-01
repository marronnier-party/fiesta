require "../../spec_helper"

describe EventMessages::Create do
  it "creates message for organizer" do
    setup = create_event_with_organizer

    response = ApiClient.auth(setup[:organizer]).exec(
      EventMessages::Create.with(setup[:event].id),
      backdoor_user_id: setup[:organizer].id,
      content: "Hello everyone"
    )

    response.status.should eq(be_found)

    messages = EventMessageQuery.new.for_event(setup[:event]).results
    messages.size.should eq(1)
    messages.first.content.should eq("Hello everyone")
  end

  it "creates message for confirmed guest" do
    setup = create_event_with_guests(1)
    guest = setup[:guests].first
    guest_user = guest.user!

    response = ApiClient.auth(guest_user).exec(
      EventMessages::Create.with(setup[:event].id),
      backdoor_user_id: guest_user.id,
      content: "Thanks for organizing"
    )

    response.status.should eq(be_found)

    messages = EventMessageQuery.new.for_event(setup[:event]).results
    messages.size.should eq(1)
  end

  it "denies access to non-participants" do
    setup = create_event_with_organizer
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      EventMessages::Create.with(setup[:event].id),
      backdoor_user_id: other_user.id,
      content: "Test"
    )

    response.status.should eq(be_found)

    messages = EventMessageQuery.new.for_event(setup[:event]).results
    messages.size.should eq(0)
  end

  it "associates message with correct user" do
    setup = create_event_with_organizer

    ApiClient.auth(setup[:organizer]).exec(
      EventMessages::Create.with(setup[:event].id),
      backdoor_user_id: setup[:organizer].id,
      body: "content=My%20message"
    )

    message = EventMessageQuery.new.for_event(setup[:event]).first
    message.user_id.should eq(setup[:organizer].id)
  end
end
