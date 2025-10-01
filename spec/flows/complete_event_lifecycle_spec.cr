require "../spec_helper"

describe "Complete event lifecycle flow", tags: "flow" do
  it "full event lifecycle from creation to completion" do
    # Setup: Create organizer and guests
    organizer = UserFactory.create
    guest1 = UserFactory.create
    guest2 = UserFactory.create
    guest3 = UserFactory.create

    # Step 1: Create location
    location = LocationFactory.create &.creator_id(organizer.id)
      .name("Family Home")
      .address("123 Main Street")
      .city("Springfield")

    # Step 2: Create draft event
    event = EventFactory.create &.creator_id(organizer.id)
      .name("Summer BBQ 2025")
      .description("Annual family barbecue celebration")
      .status(Event::Status::Draft)
      .location_id(location.id)
      .budget(500.0)

    event.status.should eq Event::Status::Draft

    # Step 3: Add tasks to event
    task1 = TaskFactory.create &.event_id(event.id)
      .name("Buy hamburgers and hot dogs")
      .category("food")
      .status(Task::Status::Pending)

    task2 = TaskFactory.create &.event_id(event.id)
      .name("Set up tables and chairs")
      .category("setup")
      .status(Task::Status::Pending)

    task3 = TaskFactory.create &.event_id(event.id)
      .name("Prepare desserts")
      .category("food")
      .status(Task::Status::Pending)

    TaskQuery.new.event_id(event.id).select_count.should eq 3

    # Step 4: Publish event
    SaveEvent.update!(event,
      status: Event::Status::Confirmed,
      start_at: 2.weeks.from_now,
      end_at: 2.weeks.from_now + 4.hours
    )

    event = EventQuery.find(event.id)
    event.status.should eq Event::Status::Confirmed

    # Step 5: Invite guests
    guest_record1 = GuestFactory.create &.user_id(guest1.id)
      .event_id(event.id)
      .status(Guest::Status::NoAnswer)

    guest_record2 = GuestFactory.create &.user_id(guest2.id)
      .event_id(event.id)
      .status(Guest::Status::NoAnswer)

    guest_record3 = GuestFactory.create &.user_id(guest3.id)
      .event_id(event.id)
      .status(Guest::Status::NoAnswer)

    GuestQuery.new.event_id(event.id).select_count.should eq 3

    # Step 6: Create poll for food preferences
    poll = PollFactory.create &.event_id(event.id)
      .question("What type of BBQ sauce?")
      .is_locked(false)

    bbq_option = PollOptionFactory.create &.poll_id(poll.id).option_text("Kansas City")
    carolina_option = PollOptionFactory.create &.poll_id(poll.id).option_text("Carolina")
    texas_option = PollOptionFactory.create &.poll_id(poll.id).option_text("Texas")

    # Step 7: Guests RSVP and vote
    SaveGuest.update!(guest_record1, status: Guest::Status::Confirmed, guest_count: 2)
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(bbq_option.id).user_id(guest1.id)

    SaveGuest.update!(guest_record2, status: Guest::Status::Confirmed, guest_count: 1)
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(bbq_option.id).user_id(guest2.id)

    SaveGuest.update!(guest_record3, status: Guest::Status::Declined)

    GuestQuery.new.event_id(event.id).status(Guest::Status::Confirmed).select_count.should eq 2
    GuestQuery.new.event_id(event.id).status(Guest::Status::Declined).select_count.should eq 1

    # Step 8: Lock poll
    SavePoll.update!(poll, is_locked: true)

    # Step 9: Assign tasks to confirmed guests
    SaveTask.update!(task1, guest_id: guest_record1.id)
    SaveTask.update!(task2, guest_id: guest_record2.id)
    SaveTask.update!(task3, guest_id: guest_record1.id)

    # Step 10: Send notifications
    NotificationFactory.create &.user_id(guest1.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::TaskAssigned)
      .title("Tasks Assigned")
      .message("You have 2 tasks for Summer BBQ")

    NotificationFactory.create &.user_id(guest2.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::TaskAssigned)
      .title("Task Assigned")
      .message("You have 1 task for Summer BBQ")

    # Step 11: Guests work on tasks
    SaveTask.update!(task1, status: Task::Status::InProgress)
    SaveTask.update!(task2, status: Task::Status::Completed, completed_at: Time.utc)
    SaveTask.update!(task3, status: Task::Status::Completed, completed_at: Time.utc)

    TaskQuery.new.event_id(event.id).status(Task::Status::Completed).select_count.should eq 2

    # Step 12: Event messages
    EventMessageFactory.create &.event_id(event.id)
      .user_id(organizer.id)
      .content("Can't wait to see everyone! BBQ starts at 2pm.")

    EventMessageFactory.create &.event_id(event.id)
      .user_id(guest1.id)
      .content("Should I bring drinks?")

    EventMessageFactory.create &.event_id(event.id)
      .user_id(organizer.id)
      .content("Yes please! That would be great.")

    EventMessageQuery.new.event_id(event.id).select_count.should eq 3

    # Step 13: Send event reminder
    NotificationFactory.create &.user_id(guest1.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::EventReminder)
      .title("Event Tomorrow")
      .message("Summer BBQ is tomorrow at 2pm!")

    NotificationFactory.create &.user_id(guest2.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::EventReminder)
      .title("Event Tomorrow")
      .message("Summer BBQ is tomorrow at 2pm!")

    # Step 14: Event day - check in guests
    SaveGuest.update!(guest_record1, status: Guest::Status::Attended)
    SaveGuest.update!(guest_record2, status: Guest::Status::Attended)

    GuestQuery.new.event_id(event.id).status(Guest::Status::Attended).select_count.should eq 2

    # Step 15: Complete remaining tasks
    SaveTask.update!(task1, status: Task::Status::Completed, completed_at: Time.utc)

    TaskQuery.new.event_id(event.id).status(Task::Status::Completed).select_count.should eq 3

    # Step 16: Mark event as done
    SaveEvent.update!(event, status: Event::Status::Done)

    event = EventQuery.find(event.id)
    event.status.should eq Event::Status::Done

    # Final verification
    event.guests.size.should eq 3
    event.location_id.should eq location.id
    TaskQuery.new.event_id(event.id).select_count.should eq 3
    PollQuery.new.event_id(event.id).select_count.should eq 1
    EventMessageQuery.new.event_id(event.id).select_count.should eq 3
    NotificationQuery.new.event_id(event.id).select_count.should eq 4
  end

  it "event with template, Secret Santa, and full coordination" do
    organizer = UserFactory.create
    location = LocationFactory.create &.creator_id(organizer.id)

    # Create template
    task_templates = [
      {"name" => "Buy gifts", "category" => "shopping"},
      {"name" => "Decorate tree", "category" => "decorations"},
      {"name" => "Prepare dinner", "category" => "food"},
    ]

    template = EventTemplateFactory.create &.creator_id(organizer.id)
      .name("Holiday Party Template")
      .location_id(location.id)
      .task_templates(task_templates.to_json)

    # Create event from template
    event = EventFactory.create &.creator_id(organizer.id)
      .name("Christmas Party 2025")
      .location_id(template.location_id)
      .status(Event::Status::Confirmed)
      .start_at(3.weeks.from_now)

    # Create tasks from template
    template.task_list.each do |task_data|
      TaskFactory.create &.event_id(event.id)
        .name(task_data["name"])
        .category(task_data["category"]?)
    end

    # Invite guests
    alice = UserFactory.create
    bob = UserFactory.create
    charlie = UserFactory.create
    diana = UserFactory.create

    guest_alice = GuestFactory.create &.user_id(alice.id).event_id(event.id).status(Guest::Status::Confirmed)
    guest_bob = GuestFactory.create &.user_id(bob.id).event_id(event.id).status(Guest::Status::Confirmed)
    guest_charlie = GuestFactory.create &.user_id(charlie.id).event_id(event.id).status(Guest::Status::Confirmed)
    guest_diana = GuestFactory.create &.user_id(diana.id).event_id(event.id).status(Guest::Status::Confirmed)

    # Setup Secret Santa
    secret_santa = SecretSantaFactory.create &.event_id(event.id)
      .gift_budget(30.0)
      .rules("Keep it fun!")
      .reveal_date(event.start_at)

    # Create assignments
    SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(guest_alice.id).receiver_id(guest_bob.id)
    SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(guest_bob.id).receiver_id(guest_charlie.id)
    SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(guest_charlie.id).receiver_id(guest_diana.id)
    SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(guest_diana.id).receiver_id(guest_alice.id)

    # Create poll for dinner preferences
    poll = PollFactory.create &.event_id(event.id).question("Turkey or Ham?")
    turkey_option = PollOptionFactory.create &.poll_id(poll.id).option_text("Turkey")
    ham_option = PollOptionFactory.create &.poll_id(poll.id).option_text("Ham")

    # Guests vote
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(turkey_option.id).user_id(alice.id)
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(turkey_option.id).user_id(bob.id)
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(ham_option.id).user_id(charlie.id)
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(turkey_option.id).user_id(diana.id)

    # Verify everything
    TaskQuery.new.event_id(event.id).select_count.should eq 3
    GuestQuery.new.event_id(event.id).status(Guest::Status::Confirmed).select_count.should eq 4
    SecretSantaAssignmentQuery.new.secret_santa_id(secret_santa.id).select_count.should eq 4
    PollVoteQuery.new.poll_id(poll.id).select_count.should eq 4
    PollVoteQuery.new.poll_option_id(turkey_option.id).select_count.should eq 3
  end
end
