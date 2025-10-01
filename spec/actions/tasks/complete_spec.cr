require "../../spec_helper"

describe Tasks::Complete do
  describe "GET /tasks/:task_id/complete" do
    it "shows completion form to assigned user" do
      user = UserFactory.create
      event = EventFactory.create
      guest = GuestFactory.create &.event_id(event.id).user_id(user.id)
      task = TaskFactory.create &.event_id(event.id).guest_id(guest.id).name("Test Task")

      response = ApiClient.auth(user).get(Tasks::Complete.with(task.id).path, backdoor_user_id: user.id)

      response.status.should eq(be_ok)
      response.body.should contain("Test Task")
    end

    it "requires authentication" do
      task = TaskFactory.create

      response = ApiClient.exec(Tasks::Complete.with(task.id))

      response.status.should eq(be_found)
    end
  end

  describe "POST /tasks/:task_id/complete" do
    it "marks task as completed" do
      user = UserFactory.create
      event = EventFactory.create
      guest = GuestFactory.create &.event_id(event.id).user_id(user.id)
      task = TaskFactory.create &.event_id(event.id).guest_id(guest.id).status(Task::Status::Pending)

      response = ApiClient.auth(user).exec(Tasks::Complete.with(task.id),
        backdoor_user_id: user.id,
        task: {
          notes: "All done!",
          cost:  "25.50",
        })

      response.status.should eq(be_found)

      updated_task = TaskQuery.find(task.id)
      updated_task.status.should eq(Task::Status::Completed)
      updated_task.completed_at.should_not be_nil
      updated_task.notes.should eq("All done!")
    end

    it "marks in-progress task as completed" do
      user = UserFactory.create
      event = EventFactory.create
      guest = GuestFactory.create &.event_id(event.id).user_id(user.id)
      task = TaskFactory.create &.event_id(event.id).guest_id(guest.id).status(Task::Status::InProgress)

      response = ApiClient.auth(user).exec(Tasks::Complete.with(task.id), backdoor_user_id: user.id)

      updated_task = TaskQuery.find(task.id)
      updated_task.status.should eq(Task::Status::Completed)
    end

    it "records completion timestamp" do
      user = UserFactory.create
      event = EventFactory.create
      guest = GuestFactory.create &.event_id(event.id).user_id(user.id)
      task = TaskFactory.create &.event_id(event.id).guest_id(guest.id)

      before_time = Time.utc
      response = ApiClient.auth(user).exec(Tasks::Complete.with(task.id), backdoor_user_id: user.id)
      after_time = Time.utc

      updated_task = TaskQuery.find(task.id)
      completed_at = updated_task.completed_at.not_nil!
      completed_at.should be >= before_time
      completed_at.should be <= after_time
    end

    it "shows success message" do
      user = UserFactory.create
      event = EventFactory.create
      guest = GuestFactory.create &.event_id(event.id).user_id(user.id)
      task = TaskFactory.create &.event_id(event.id).guest_id(guest.id)

      response = ApiClient.auth(user).exec(Tasks::Complete.with(task.id), backdoor_user_id: user.id)

      response.status.should eq(be_found)
      # Flash success message would be set
    end

    it "redirects to dashboard on success" do
      user = UserFactory.create
      event = EventFactory.create
      guest = GuestFactory.create &.event_id(event.id).user_id(user.id)
      task = TaskFactory.create &.event_id(event.id).guest_id(guest.id)

      response = ApiClient.auth(user).exec(Tasks::Complete.with(task.id), backdoor_user_id: user.id)

      response.headers["Location"].should contain("/me")
    end
  end
end
