require "../../spec_helper"

describe EventTemplates::CreateFromEvent do
  it "creates template from event" do
    user = UserFactory.create
    location = LocationFactory.create
    event = EventFactory.create &.creator_id(user.id).location_id(location.id).name("Summer BBQ")

    # Add some guests and tasks
    guest = GuestFactory.create &.event_id(event.id).status(:confirmed)
    task = TaskFactory.create &.event_id(event.id).name("Bring drinks")

    response = ApiClient.auth(user).exec(
      EventTemplates::CreateFromEvent.with(event.id),
      backdoor_user_id: user.id,
      template_name: "BBQ Template"
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/event_templates")

    template = EventTemplateQuery.new.for_user(user).first
    template.name.should eq("BBQ Template")
    template.task_list.size.should eq(1)
    template.task_list.first["name"].should eq("Bring drinks")
    template.guest_ids.size.should eq(1)
  end

  it "prevents non-creator from creating template" do
    user = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(other_user.id)

    response = ApiClient.auth(user).exec(
      EventTemplates::CreateFromEvent.with(event.id),
      backdoor_user_id: user.id
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/events/#{event.id}")
  end

  it "requires authentication" do
    event = EventFactory.create

    response = ApiClient.exec(EventTemplates::CreateFromEvent.with(event.id))

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
