require "../spec_helper"

describe SaveTask do
  it "requires name and event_id" do
    SaveTask.create do |operation, task|
      task.should be_nil
      operation.name.errors.should contain("is required")
      operation.event_id.errors.should contain("is required")
    end
  end

  it "sets completed_at when status is Completed" do
    event = EventFactory.create

    task = SaveTask.create!(
      event_id: event.id,
      name: "Buy groceries",
      status: Task::Status::Completed
    )

    task.completed_at.should_not be_nil
  end

  it "clears completed_at when status changes away from Completed" do
    event = EventFactory.create

    task = SaveTask.create!(
      event_id: event.id,
      name: "Buy groceries",
      status: Task::Status::Completed
    )

    task.completed_at.should_not be_nil

    updated_task = SaveTask.update!(task, status: Task::Status::Pending)
    updated_task.completed_at.should be_nil
  end

  it "can assign tasks to guests" do
    event = EventFactory.create
    user = UserFactory.create
    guest = SaveGuest.create!(user_id: user.id, event_id: event.id)

    task = SaveTask.create!(
      event_id: event.id,
      name: "Setup tables",
      guest_id: guest.id
    )

    task.guest_id.should eq guest.id
  end

  it "supports task categories and notes" do
    event = EventFactory.create

    task = SaveTask.create!(
      event_id: event.id,
      name: "Buy wine",
      category: "Shopping",
      notes: "Get 3 bottles of red"
    )

    task.category.should eq "Shopping"
    task.notes.should eq "Get 3 bottles of red"
  end
end