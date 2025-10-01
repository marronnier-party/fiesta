require "../../spec_helper"

describe SecretSanta::Randomize do
  it "creates random assignments for organizer" do
    setup = create_secret_santa_with_participants(4)

    response = ApiClient.auth(setup[:organizer]).exec(
      SecretSanta::Randomize.with(setup[:event].id),
      backdoor_user_id: setup[:organizer].id
    )

    response.status.should eq(be_found)

    assignments = SecretSantaAssignmentQuery.new
      .for_secret_santa(setup[:secret_santa])
      .results

    assignments.size.should eq(4)
  end

  it "denies access to non-organizer" do
    setup = create_secret_santa_with_participants(3)
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      SecretSanta::Randomize.with(setup[:event].id),
      backdoor_user_id: other_user.id
    )

    response.status.should eq(be_found)
  end

  it "requires at least 2 participants" do
    setup = create_event_with_organizer
    secret_santa = SecretSantaFactory.create &.event_id(setup[:event].id)

    response = ApiClient.auth(setup[:organizer]).exec(
      SecretSanta::Randomize.with(setup[:event].id),
      backdoor_user_id: setup[:organizer].id
    )

    response.status.should eq(be_found)

    assignments = SecretSantaAssignmentQuery.new
      .for_secret_santa(secret_santa)
      .results

    assignments.size.should eq(0)
  end
end
