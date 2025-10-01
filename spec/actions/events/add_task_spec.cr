require "../../spec_helper"

describe Events::AddTask do
  describe "GET /events/:event_id/tasks/new" do
    it "shows task form to organizer" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      guest_user = UserFactory.create
      guest = GuestFactory.create &.event_id(event.id).user_id(guest_user.id).status(Guest::Status::Confirmed)

      response = ApiClient.auth(organizer).get(Events::AddTask.with(event.id).path, backdoor_user_id: organizer.id)

      response.status.should eq(be_ok)
      response.body.should contain("Ajouter une tâche") # Add task
      response.body.should contain(guest_user.name)
    end

    it "only shows confirmed guests" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      confirmed_user = UserFactory.create
      pending_user = UserFactory.create
      GuestFactory.create &.event_id(event.id).user_id(confirmed_user.id).status(Guest::Status::Confirmed)
      GuestFactory.create &.event_id(event.id).user_id(pending_user.id).status(Guest::Status::NoAnswer)

      response = ApiClient.auth(organizer).get(Events::AddTask.with(event.id).path, backdoor_user_id: organizer.id)

      response.body.should contain(confirmed_user.name)
      response.body.should_not contain(pending_user.name)
    end

    it "prevents non-organizers from accessing" do
      organizer = UserFactory.create
      other_user = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)

      response = ApiClient.auth(other_user).get(Events::AddTask.with(event.id).path, backdoor_user_id: other_user.id)

      response.status.should eq(be_found)
    end
  end

  describe "POST /events/:event_id/tasks" do
    it "creates task with valid params" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      guest_user = UserFactory.create
      guest = GuestFactory.create &.event_id(event.id).user_id(guest_user.id).status(Guest::Status::Confirmed)

      response = ApiClient.auth(organizer).exec(Events::AddTask.with(event.id), backdoor_user_id: organizer.id, task: {
        name:     "Bring desserts",
        guest_id: guest.id,
        category: "food",
        notes:    "Chocolate cake preferred",
      })

      response.status.should eq(be_found)

      task = TaskQuery.new.name("Bring desserts").first
      task.event_id.should eq(event.id)
      task.guest_id.should eq(guest.id)
      task.category.should eq("food")
    end

    it "requires name" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      guest = GuestFactory.create &.event_id(event.id)

      response = ApiClient.auth(organizer).exec(Events::AddTask.with(event.id), backdoor_user_id: organizer.id, task: {
        guest_id: guest.id,
      })

      response.status.should eq(be_ok)
      response.body.should contain("name")
    end

    it "prevents non-organizers from creating tasks" do
      organizer = UserFactory.create
      other_user = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      guest = GuestFactory.create &.event_id(event.id)

      response = ApiClient.auth(other_user).exec(Events::AddTask.with(event.id), backdoor_user_id: other_user.id, task: {
        name:     "Test Task",
        guest_id: guest.id,
      })

      response.status.should eq(be_found)
      TaskQuery.new.name("Test Task").first?.should be_nil
    end
  end
end
