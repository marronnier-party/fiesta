require "../../spec_helper"

describe Polls::Vote do
  it "records a vote" do
    user = UserFactory.create
    event = EventFactory.create
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)
    poll = PollFactory.create &.event_id(event.id)
    option = PollOptionFactory.create &.poll_id(poll.id)

    response = ApiClient.auth(user).exec(
      Polls::Vote.with(poll.id),
      backdoor_user_id: user.id,
      poll_option_id: option.id.to_s
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/polls/#{poll.id}")

    vote = PollVoteQuery.new.for_user(user).for_poll(poll).first
    vote.poll_option_id.should eq(option.id)
  end

  it "changes vote when voting again" do
    user = UserFactory.create
    event = EventFactory.create
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)
    poll = PollFactory.create &.event_id(event.id)
    option1 = PollOptionFactory.create &.poll_id(poll.id)
    option2 = PollOptionFactory.create &.poll_id(poll.id).option_text("Option 2")

    # First vote
    ApiClient.auth(user).exec(
      Polls::Vote.with(poll.id),
      backdoor_user_id: user.id,
      poll_option_id: option1.id.to_s
    )

    # Second vote (change)
    response = ApiClient.auth(user).exec(
      Polls::Vote.with(poll.id),
      backdoor_user_id: user.id,
      poll_option_id: option2.id.to_s
    )

    response.status.should eq(HTTP::Status::FOUND)

    # Should only have one vote
    votes = PollVoteQuery.new.for_user(user).for_poll(poll).results
    votes.size.should eq(1)
    votes.first.poll_option_id.should eq(option2.id)
  end

  it "prevents voting on locked poll" do
    user = UserFactory.create
    event = EventFactory.create
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)
    poll = PollFactory.create &.event_id(event.id).is_locked(true)
    option = PollOptionFactory.create &.poll_id(poll.id)

    response = ApiClient.auth(user).exec(
      Polls::Vote.with(poll.id),
      backdoor_user_id: user.id,
      poll_option_id: option.id.to_s
    )

    response.status.should eq(HTTP::Status::FOUND)
    PollVoteQuery.new.for_user(user).results.size.should eq(0)
  end

  it "requires authentication" do
    poll = PollFactory.create
    option = PollOptionFactory.create &.poll_id(poll.id)

    response = ApiClient.exec(
      Polls::Vote.with(poll.id),
      poll_option_id: option.id.to_s
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
