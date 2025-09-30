require "../../spec_helper"

describe Polls::ToggleLock do
  it "locks an unlocked poll" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)
    poll = PollFactory.create &.event_id(event.id).is_locked(false)

    response = ApiClient.auth(user).exec(
      Polls::ToggleLock.with(poll.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)

    poll = PollQuery.new.find(poll.id)
    poll.is_locked.should be_true
  end

  it "unlocks a locked poll" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)
    poll = PollFactory.create &.event_id(event.id).is_locked(true)

    response = ApiClient.auth(user).exec(
      Polls::ToggleLock.with(poll.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)

    poll = PollQuery.new.find(poll.id)
    poll.is_locked.should be_false
  end

  it "prevents non-creator from toggling lock" do
    user = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(other_user.id)
    poll = PollFactory.create &.event_id(event.id)

    response = ApiClient.auth(user).exec(
      Polls::ToggleLock.with(poll.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/polls/#{poll.id}")
  end

  it "requires authentication" do
    poll = PollFactory.create

    response = ApiClient.exec(Polls::ToggleLock.with(poll.id))

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
