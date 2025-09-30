require "../spec_helper"

describe TaskQuery do
  describe "for_event" do
    it "returns tasks for specific event" do
      event = EventFactory.create
      task1 = TaskFactory.create &.event_id(event.id)
      task2 = TaskFactory.create &.event_id(event.id)
      other_task = TaskFactory.create

      results = TaskQuery.new.for_event(event).results

      results.should contain(task1)
      results.should contain(task2)
      results.should_not contain(other_task)
    end
  end

  describe "for_guest" do
    it "returns tasks assigned to specific guest" do
      guest = GuestFactory.create
      task1 = TaskFactory.create &.guest_id(guest.id)
      task2 = TaskFactory.create &.guest_id(guest.id)
      other_task = TaskFactory.create

      results = TaskQuery.new.for_guest(guest).results

      results.should contain(task1)
      results.should contain(task2)
      results.should_not contain(other_task)
    end
  end

  describe "by_status" do
    it "filters by pending status" do
      pending = TaskFactory.create &.status(Task::Status::Pending)
      in_progress = TaskFactory.create &.status(Task::Status::InProgress)
      completed = TaskFactory.create &.status(Task::Status::Completed)

      results = TaskQuery.new.pending.results

      results.should contain(pending)
      results.should_not contain(in_progress)
      results.should_not contain(completed)
    end

    it "filters by in-progress status" do
      in_progress = TaskFactory.create &.status(Task::Status::InProgress)
      pending = TaskFactory.create &.status(Task::Status::Pending)

      results = TaskQuery.new.in_progress.results

      results.should contain(in_progress)
      results.should_not contain(pending)
    end

    it "filters by completed status" do
      completed = TaskFactory.create &.status(Task::Status::Completed)
      pending = TaskFactory.create &.status(Task::Status::Pending)

      results = TaskQuery.new.completed.results

      results.should contain(completed)
      results.should_not contain(pending)
    end
  end

  describe "by_category" do
    it "filters by category" do
      food_task = TaskFactory.create &.category("food")
      beverage_task = TaskFactory.create &.category("beverages")
      no_category = TaskFactory.create

      results = TaskQuery.new.by_category("food").results

      results.should contain(food_task)
      results.should_not contain(beverage_task)
      results.should_not contain(no_category)
    end
  end

  describe "ordered_by_position" do
    it "orders tasks by position" do
      task3 = TaskFactory.create &.position(30)
      task1 = TaskFactory.create &.position(10)
      task2 = TaskFactory.create &.position(20)

      results = TaskQuery.new.ordered_by_position.results

      results[0].id.should eq(task1.id)
      results[1].id.should eq(task2.id)
      results[2].id.should eq(task3.id)
    end
  end

  describe "preload_guest" do
    it "preloads assigned guest" do
      user = UserFactory.create &.name("Test User")
      event = EventFactory.create
      guest = GuestFactory.create &.user_id(user.id).event_id(event.id)
      task = TaskFactory.create &.event_id(event.id).guest_id(guest.id)

      result = TaskQuery.new.preload_guest.find(task.id)

      result.guest.should_not be_nil
      result.guest.not_nil!.user_id.should eq(user.id)
    end
  end
end
