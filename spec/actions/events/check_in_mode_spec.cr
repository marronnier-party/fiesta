require "../../spec_helper"

describe Events::CheckInMode do
  it "shows check-in page to organizer" do
    setup = create_event_with_guests(3)

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::CheckInMode.with(setup[:event].id)
    )

    response.status.should eq(200)
    response.body.should contain("Enregistrement")
  end

  it "shows list of confirmed guests" do
    setup = create_event_with_guests(4)

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::CheckInMode.with(setup[:event].id)
    )

    setup[:guests].each do |guest|
      response.body.should contain(guest.user!.name)
    end
  end

  it "shows check-in stats" do
    setup = create_event_with_guests(5)

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::CheckInMode.with(setup[:event].id)
    )

    response.body.should contain("Attendus")
    response.body.should contain("Enregistrés")
  end

  it "denies access to non-organizer" do
    setup = create_event_with_guests(2)
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      Events::CheckInMode.with(setup[:event].id)
    )

    response.status.should eq(302)
  end
end
