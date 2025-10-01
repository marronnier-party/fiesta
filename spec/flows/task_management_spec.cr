require "../spec_helper"

describe "Task management flow", tags: "flow" do
  it "allows organizer to create a task" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)

    flow = TaskFlow.new(user, event)
    flow.create_task("Buy decorations", "decorations")
    flow.should_see_task("Buy decorations")
  end

  it "allows organizer to assign task to guest" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id).status(Guest::Status::Confirmed)
    task = TaskFactory.create &.event_id(event.id).name("Bring dessert")

    flow = TaskFlow.new(organizer, event)
    flow.assign_task_to_guest(task, guest)

    task.reload
    task.guest_id.should eq guest.id
  end

  it "allows guest to mark task in progress" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id)
    task = TaskFactory.create &.event_id(event.id).guest_id(guest.id).status(Task::Status::Pending)

    flow = TaskFlow.new(guest_user, event)
    flow.mark_task_in_progress(task)
    flow.should_see_task_status("InProgress")

    task.reload
    task.status.should eq Task::Status::InProgress
  end

  it "allows guest to complete assigned task" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id)
    task = TaskFactory.create &.event_id(event.id).guest_id(guest.id).status(Task::Status::InProgress)

    flow = TaskFlow.new(guest_user, event)
    flow.complete_task(task)
    flow.should_see_task_status("Completed")

    task.reload
    task.status.should eq Task::Status::Completed
    task.completed_at.should_not be_nil
  end

  it "complete task workflow: create -> assign -> start -> complete" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id).status(Guest::Status::Confirmed)

    # Organizer creates task
    organizer_flow = TaskFlow.new(organizer, event)
    organizer_flow.create_task("Prepare salad", "food")

    task = TaskQuery.new.event_id(event.id).name("Prepare salad").first

    # Organizer assigns to guest
    organizer_flow.assign_task_to_guest(task, guest)

    task.reload
    task.guest_id.should eq guest.id

    # Guest starts task
    guest_flow = TaskFlow.new(guest_user, event)
    guest_flow.mark_task_in_progress(task)

    task.reload
    task.status.should eq Task::Status::InProgress

    # Guest completes task
    guest_flow.complete_task(task)

    task.reload
    task.status.should eq Task::Status::Completed
    task.completed_at.should_not be_nil
  end

  it "allows creating tasks in different categories" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)

    flow = TaskFlow.new(user, event)

    flow.create_task("Buy balloons", "decorations")
    flow.create_task("Order pizza", "food")
    flow.create_task("Book venue", "logistics")

    TaskQuery.new.event_id(event.id).select_count.should eq 3
    TaskQuery.new.event_id(event.id).category("decorations").select_count.should eq 1
    TaskQuery.new.event_id(event.id).category("food").select_count.should eq 1
    TaskQuery.new.event_id(event.id).category("logistics").select_count.should eq 1
  end

  it "allows viewing all tasks for an event" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)

    TaskFactory.create &.event_id(event.id).name("Task 1").status(Task::Status::Pending)
    TaskFactory.create &.event_id(event.id).name("Task 2").status(Task::Status::InProgress)
    TaskFactory.create &.event_id(event.id).name("Task 3").status(Task::Status::Completed)

    flow = TaskFlow.new(user, event)
    flow.visit Tasks::Index.with(event.id), as: user

    flow.should_see_task("Task 1")
    flow.should_see_task("Task 2")
    flow.should_see_task("Task 3")
  end
end
