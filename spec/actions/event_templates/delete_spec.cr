require "../../spec_helper"

describe EventTemplates::Delete do
  it "deletes a template" do
    user = UserFactory.create
    template = EventTemplateFactory.create &.creator_id(user.id)

    response = ApiClient.auth(user).exec(EventTemplates::Delete.with(template.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/event_templates")

    EventTemplateQuery.new.id(template.id).first?.should be_nil
  end

  it "prevents deleting another user's template" do
    user = UserFactory.create
    other_user = UserFactory.create
    template = EventTemplateFactory.create &.creator_id(other_user.id)

    begin
      response = ApiClient.auth(user).exec(EventTemplates::Delete.with(template.id),
        backdoor_user_id: user.id
      )
      response.status.should_not eq(HTTP::Status::FOUND)
    rescue Avram::RecordNotFoundError
      # Expected
    end

    EventTemplateQuery.new.id(template.id).first?.should_not be_nil
  end

  it "requires authentication" do
    template = EventTemplateFactory.create

    response = ApiClient.exec(EventTemplates::Delete.with(template.id))

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
