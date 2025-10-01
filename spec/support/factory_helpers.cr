module TaskSpecHelpers
  # Create a complete task setup: organizer -> event -> guest (assignee) -> task
  def create_task_setup(status : Task::Status = Task::Status::Pending, name : String = "Test Task")
    organizer = UserFactory.create
    assignee = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest = GuestFactory.create &.event_id(event.id).user_id(assignee.id).status(Guest::Status::Confirmed)

    task = TaskFactory.create &.event_id(event.id).guest_id(guest.id).status(status).name(name)

    {
      organizer: organizer,
      assignee: assignee,
      event: event,
      guest: guest,
      task: task
    }
  end
end
