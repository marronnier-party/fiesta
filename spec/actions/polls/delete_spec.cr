require "../../spec_helper"

describe Polls::Delete do
  it "deletes a poll" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)
    poll = PollFactory.create &.event_id(event.id)

    response = ApiClient.auth(user).exec(
      Polls::Delete.with(poll.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/events/#{event.id}")

    PollQuery.new.id(poll.id).first?.should be_nil
  end

  it "prevents non-creator from deleting" do
    user = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(other_user.id)
    poll = PollFactory.create &.event_id(event.id)

    response = ApiClient.auth(user).exec(
      Polls::Delete.with(poll.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/events/#{event.id}")

    PollQuery.new.id(poll.id).first?.should_not be_nil
  end

  it "requires authentication" do
    poll = PollFactory.create

    response = ApiClient.exec(Polls::Delete.with(poll.id))

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
