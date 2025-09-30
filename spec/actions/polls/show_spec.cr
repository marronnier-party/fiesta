require "../../spec_helper"

describe Polls::Show do
  it "shows poll to event guest" do
    user = UserFactory.create
    event = EventFactory.create
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)
    poll = PollFactory.create &.event_id(event.id)
    option = PollOptionFactory.create &.poll_id(poll.id)

    response = ApiClient.auth(user).exec(
      Polls::Show.with(poll.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::OK)
    response.body.should contain(poll.question)
  end

  it "prevents non-guests from viewing" do
    user = UserFactory.create
    event = EventFactory.create
    poll = PollFactory.create &.event_id(event.id)

    response = ApiClient.auth(user).exec(
      Polls::Show.with(poll.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/me")
  end

  it "requires authentication" do
    poll = PollFactory.create

    response = ApiClient.exec(Polls::Show.with(poll.id))

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
