require "../../spec_helper"

describe Events::ExpenseSplit do
  it "shows expense split page to organizer" do
    setup = create_event_with_guests(3)
    SaveEvent.update!(setup[:event], total_cost: 90.0)

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ExpenseSplit.with(setup[:event].id)
    )

    response.status.should eq(200)
    response.body.should contain("Répartition des dépenses")
  end

  it "displays total expenses" do
    setup = create_event_with_guests(2)
    SaveEvent.update!(setup[:event], total_cost: 150.0)

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ExpenseSplit.with(setup[:event].id)
    )

    response.body.should contain("150.00")
  end

  it "shows split amounts for each guest" do
    setup = create_event_with_guests(3)
    SaveEvent.update!(setup[:event], total_cost: 90.0)

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ExpenseSplit.with(setup[:event].id)
    )

    setup[:guests].each do |guest|
      response.body.should contain(guest.user!.name)
    end
    response.body.should contain("30.00") # 90 / 3
  end

  it "supports different split methods" do
    setup = create_event_with_guests(2)
    SaveEvent.update!(setup[:event], total_cost: 100.0)

    # Test equal split
    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ExpenseSplit.with(setup[:event].id) + "?method=equal"
    )
    response.body.should contain("50.00")

    # Test by headcount
    SaveGuest.update!(setup[:guests][0], guest_count: 2)
    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ExpenseSplit.with(setup[:event].id) + "?method=by_headcount"
    )
    response.status.should eq(200)
  end

  it "denies access to non-organizer" do
    setup = create_event_with_guests(2)
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      Events::ExpenseSplit.with(setup[:event].id)
    )

    response.status.should eq(302)
  end

  it "shows split method selector" do
    setup = create_event_with_guests(2)
    SaveEvent.update!(setup[:event], total_cost: 80.0)

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ExpenseSplit.with(setup[:event].id)
    )

    response.body.should contain("Égale")
    response.body.should contain("Par nombre de personnes")
  end
end
