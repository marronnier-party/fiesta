require "../../spec_helper"

describe Events::Create do
  it "creates event with valid params" do
    user = UserFactory.create
    location = LocationFactory.create

    response = ApiClient.auth(user).exec(Events::Create,
      backdoor_user_id: user.id,
      event: {
        name:        "New Event",
        description: "Event description",
        location_id: location.id,
        start_at:    (Time.utc + 1.day).to_s,
        status:      Event::Status::Confirmed.value,
      })

    response.status.should eq(be_found)
    response.headers["Location"].should contain("/events/")

    event = EventQuery.new.name("New Event").first
    event.creator_id.should eq(user.id)
    event.description.should eq("Event description")
  end

  it "fails with missing name" do
    user = UserFactory.create

    response = ApiClient.auth(user).exec(Events::Create,
      backdoor_user_id: user.id,
      event: {
        description: "Event description",
      })

    response.status.should eq(be_ok)
    response.body.should contain("name") # Error for name field
  end

  it "allows draft events with past dates" do
    user = UserFactory.create
    past_time = Time.utc - 1.day

    response = ApiClient.auth(user).exec(Events::Create,
      backdoor_user_id: user.id,
      event: {
        name:     "Past Event",
        start_at: past_time.to_s,
        status:   Event::Status::Draft.value,
      })

    response.status.should eq(be_found)
    EventQuery.new.name("Past Event").first.status.should eq(Event::Status::Draft)
  end

  it "prevents confirmed events with past dates" do
    user = UserFactory.create
    past_time = Time.utc - 1.day

    response = ApiClient.auth(user).exec(Events::Create,
      backdoor_user_id: user.id,
      event: {
        name:     "Past Event",
        start_at: past_time.to_s,
        status:   Event::Status::Confirmed.value,
      })

    response.status.should eq(be_ok)
    response.body.should contain("future") # Error message
  end

  it "requires authentication" do
    response = ApiClient.exec(Events::Create, event: {name: "Test"})

    response.status.should eq(be_found)
    EventQuery.new.name("Test").first?.should be_nil
  end

  it "sets creator to current user" do
    user = UserFactory.create

    response = ApiClient.auth(user).exec(Events::Create,
      backdoor_user_id: user.id,
      event: {
        name: "User Event",
      })

    event = EventQuery.new.name("User Event").first
    event.creator_id.should eq(user.id)
  end
end
