require "../../spec_helper"

describe Events::Index do
  it "shows events for the current user" do
    user = UserFactory.create
    event1 = EventFactory.create &.creator_id(user.id)
    event2 = EventFactory.create &.creator_id(user.id)
    other_event = EventFactory.create

    response = ApiClient.auth(user).exec(Events::Index, backdoor_user_id: user.id)

    response.status.should eq(be_ok)
    response.body.should contain(event1.name)
    response.body.should contain(event2.name)
    response.body.should_not contain(other_event.name)
  end

  it "shows empty state when user has no events" do
    user = UserFactory.create
    EventFactory.create # Someone else's event

    response = ApiClient.auth(user).exec(Events::Index, backdoor_user_id: user.id)

    response.status.should eq(be_ok)
    response.body.should contain("Aucun événement") # French empty state
  end

  it "requires authentication" do
    response = ApiClient.exec(Events::Index)

    response.status.should eq(be_found)
  end

  it "orders events by date" do
    user = UserFactory.create
    future_event = EventFactory.create &.creator_id(user.id).start_at(Time.utc + 7.days)
    near_event = EventFactory.create &.creator_id(user.id).start_at(Time.utc + 1.day)

    response = ApiClient.auth(user).exec(Events::Index, backdoor_user_id: user.id)

    near_index = response.body.index(near_event.name).not_nil!
    future_index = response.body.index(future_event.name).not_nil!
    near_index.should be < future_index
  end
end
