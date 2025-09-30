require "../../spec_helper"

describe Events::ApplyTaskSuggestions do
  it "creates selected tasks" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id).event_type("birthday")

    response = ApiClient.auth(user).exec(
      Events::ApplyTaskSuggestions.with(event.id),
      backdoor_user_id: user.id,
      "selected_tasks[]": ["Send invitations", "Order birthday cake"]
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/events/#{event.id}")

    tasks = TaskQuery.new.for_event(event).results
    tasks.size.should eq(2)
    tasks.map(&.name).should contain("Send invitations")
    tasks.map(&.name).should contain("Order birthday cake")
  end

  it "creates no tasks when none selected" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id).event_type("birthday")

    response = ApiClient.auth(user).exec(
      Events::ApplyTaskSuggestions.with(event.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)

    tasks = TaskQuery.new.for_event(event).results
    tasks.size.should eq(0)
  end

  it "prevents non-creator from applying suggestions" do
    user = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(other_user.id)

    response = ApiClient.auth(user).exec(
      Events::ApplyTaskSuggestions.with(event.id),
      backdoor_user_id: user.id,
      "selected_tasks[]": ["Test task"]
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/events/#{event.id}")
  end

  it "requires authentication" do
    event = EventFactory.create

    response = ApiClient.exec(
      Events::ApplyTaskSuggestions.with(event.id),
      "selected_tasks[]": ["Test"]
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
