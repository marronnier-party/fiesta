require "../../spec_helper"

describe SecretSanta::Enable do
  it "creates Secret Santa for organizer" do
    setup = create_event_with_organizer
    organizer = setup[:organizer]
    event = setup[:event]

    response = ApiClient.auth(organizer).exec(
      SecretSanta::Enable.with(event.id)
    )

    response.status.should eq(302)

    secret_santa = SecretSantaQuery.new.for_event(event).first?
    secret_santa.should_not be_nil
  end

  it "redirects to Secret Santa show page" do
    setup = create_event_with_organizer

    response = ApiClient.auth(setup[:organizer]).exec(
      SecretSanta::Enable.with(setup[:event].id)
    )

    response.headers["Location"].should contain("secret_santa")
  end

  it "denies access to non-organizer" do
    setup = create_event_with_organizer
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      SecretSanta::Enable.with(setup[:event].id)
    )

    response.status.should eq(302)
    response.headers["Location"].should_not contain("secret_santa")
  end

  it "handles already existing Secret Santa" do
    setup = create_event_with_organizer
    SecretSantaFactory.create &.event_id(setup[:event].id)

    response = ApiClient.auth(setup[:organizer]).exec(
      SecretSanta::Enable.with(setup[:event].id)
    )

    response.status.should eq(302)
    response.headers["Location"].should contain("secret_santa")
  end
end
