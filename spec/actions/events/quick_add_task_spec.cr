require "../../spec_helper"

describe Events::QuickAddTask do
  it "creates a task via htmx" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)

    response = ApiClient.auth(user)
      .headers("HX-Request": "true")
      .exec(
        Events::QuickAddTask.with(event.id),
        backdoor_user_id: user.id,
        "task:name": "New Task"
      )

    response.status.should eq(HTTP::Status::OK)

    # Verify task was created
    task = TaskQuery.new.event_id(event.id).first
    task.name.should eq("New Task")
    task.status.should eq(Task::Status::Pending)

    # Check htmx response contains task card
    response.body.should contain("task-#{task.id}")
    response.body.should contain("New Task")

    # Check success message header
    response.headers["X-Success-Message"]?.should_not be_nil
  end

  it "returns 403 for non-organizers" do
    organizer = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    response = ApiClient.auth(other_user)
      .headers("HX-Request": "true")
      .exec(
        Events::QuickAddTask.with(event.id),
        backdoor_user_id: other_user.id,
        "task:name": "Unauthorized Task"
      )

    response.status.should eq(HTTP::Status::FORBIDDEN)

    # Verify task was not created
    TaskQuery.new.event_id(event.id).select_count.should eq(0)
  end

  it "works without htmx (progressive enhancement)" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)

    response = ApiClient.auth(user)
      .exec(
        Events::QuickAddTask.with(event.id),
        backdoor_user_id: user.id,
        "task:name": "Task Without HTMX"
      )

    response.status.should eq(HTTP::Status::FOUND)

    # Verify task was created
    task = TaskQuery.new.event_id(event.id).first
    task.name.should eq("Task Without HTMX")
  end

  it "includes confirmation dialog in response" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)

    response = ApiClient.auth(user)
      .headers("HX-Request": "true")
      .exec(
        Events::QuickAddTask.with(event.id),
        backdoor_user_id: user.id,
        "task:name": "Task With Dialog"
      )

    # Check response includes confirmation dialog
    task = TaskQuery.new.event_id(event.id).first
    response.body.should contain("confirm-delete-task-#{task.id}")
  end
end
