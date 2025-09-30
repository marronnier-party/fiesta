require "../../spec_helper"

describe SecretSanta::Show do
  it "shows Secret Santa page to organizer" do
    setup = create_secret_santa_with_participants(3)

    response = ApiClient.auth(setup[:organizer]).exec(
      SecretSanta::Show.with(setup[:event].id)
    )

    response.status.should eq(200)
    response.body.should contain("Père Noël secret")
  end

  it "shows all assignments to organizer" do
    setup = create_secret_santa_with_participants(4)
    SecretSantaService.randomize_assignments(
      setup[:secret_santa],
      setup[:guests]
    )

    response = ApiClient.auth(setup[:organizer]).exec(
      SecretSanta::Show.with(setup[:event].id)
    )

    response.body.should contain("Attributions")
    # Should show participant names
    setup[:guests].each do |guest|
      response.body.should contain(guest.user!.name)
    end
  end

  it "shows only own assignment to participant" do
    setup = create_secret_santa_with_participants(3)
    SecretSantaService.randomize_assignments(
      setup[:secret_santa],
      setup[:guests]
    )

    participant_guest = setup[:guests].first
    participant_user = participant_guest.user!

    response = ApiClient.auth(participant_user).exec(
      SecretSanta::Show.with(setup[:event].id)
    )

    response.status.should eq(200)
    response.body.should contain("Vous offrez un cadeau")
  end

  it "denies access to non-participants" do
    setup = create_secret_santa_with_participants(2)
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      SecretSanta::Show.with(setup[:event].id)
    )

    response.status.should eq(302)
  end

  it "returns 404 when Secret Santa doesn't exist" do
    setup = create_event_with_organizer

    response = ApiClient.auth(setup[:organizer]).exec(
      SecretSanta::Show.with(setup[:event].id)
    )

    response.status.should eq(302)
  end
end
