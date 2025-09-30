require "../../spec_helper"

describe EventTemplates::Index do
  it "shows user's templates" do
    user = UserFactory.create
    template1 = EventTemplateFactory.create &.creator_id(user.id).name("Template 1")
    template2 = EventTemplateFactory.create &.creator_id(user.id).name("Template 2")
    other_template = EventTemplateFactory.create &.name("Other Template")

    response = ApiClient.auth(user).exec(EventTemplates::Index, backdoor_user_id: user.id)

    response.status.should eq(HTTP::Status::OK)
    response.body.should contain("Template 1")
    response.body.should contain("Template 2")
    response.body.should_not contain("Other Template")
  end

  it "requires authentication" do
    response = ApiClient.exec(EventTemplates::Index)

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
