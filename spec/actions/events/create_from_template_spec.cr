require "../../spec_helper"

describe Events::CreateFromTemplate do
  it "shows form pre-filled with template data" do
    user = UserFactory.create
    location = LocationFactory.create
    template = EventTemplateFactory.create &.creator_id(user.id).location_id(location.id)

    response = ApiClient.auth(user).exec(
      Events::CreateFromTemplate.with(template.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::OK)
    response.body.should contain(template.name)
  end

  it "requires authentication" do
    template = EventTemplateFactory.create

    response = ApiClient.exec(Events::CreateFromTemplate.with(template.id))

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
