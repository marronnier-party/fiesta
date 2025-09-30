require "../../spec_helper"

describe Polls::Create do
  it "creates a poll with options" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)

    response = ApiClient.auth(user).exec(
      Polls::Create.with(event.id),
      backdoor_user_id: user.id,
      poll: {question: "Best time?"},
      "poll_options[]": ["Morning", "Afternoon", "Evening"]
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/events/#{event.id}")

    poll = PollQuery.new.for_event(event).first
    poll.question.should eq("Best time?")

    options = PollOptionQuery.new.for_poll(poll).results
    options.size.should eq(3)
    options.map(&.option_text).should contain("Morning")
  end

  it "prevents non-creator from creating polls" do
    user = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(other_user.id)

    response = ApiClient.auth(user).exec(
      Polls::Create.with(event.id),
      backdoor_user_id: user.id,
      poll: {question: "Test?"}
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/events/#{event.id}")
  end

  it "requires authentication" do
    event = EventFactory.create

    response = ApiClient.exec(
      Polls::Create.with(event.id),
      poll: {question: "Test?"}
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
