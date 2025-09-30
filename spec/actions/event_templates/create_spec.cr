require "../../spec_helper"

describe EventTemplates::Create do
  it "creates a template" do
    user = UserFactory.create
    location = LocationFactory.create

    response = ApiClient.auth(user).exec(EventTemplates::Create,
      backdoor_user_id: user.id,
      event_template: {
        name: "My Template",
        description: "Test template",
        location_id: location.id
      }
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/event_templates")

    template = EventTemplateQuery.new.for_user(user).first
    template.name.should eq("My Template")
    template.location_id.should eq(location.id)
  end

  it "requires authentication" do
    response = ApiClient.exec(EventTemplates::Create,
      event_template: {name: "Test"}
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
