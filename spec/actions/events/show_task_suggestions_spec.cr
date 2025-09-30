require "../../spec_helper"

describe Events::ShowTaskSuggestions do
  it "shows suggestions page" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id).event_type("bbq")

    response = ApiClient.auth(user).exec(
      Events::ShowTaskSuggestions.with(event.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::OK)
    response.body.should contain("grill")
  end

  it "prevents non-creator from viewing suggestions" do
    user = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(other_user.id)

    response = ApiClient.auth(user).exec(
      Events::ShowTaskSuggestions.with(event.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/events/#{event.id}")
  end

  it "requires authentication" do
    event = EventFactory.create

    response = ApiClient.exec(Events::ShowTaskSuggestions.with(event.id))

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
