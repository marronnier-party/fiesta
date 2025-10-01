require "../spec_helper"

describe "Messaging and notifications flow", tags: "flow" do
  it "allows user to send message to event" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    message = EventMessageFactory.create &.event_id(event.id)
      .user_id(organizer.id)
      .content("Looking forward to seeing everyone!")

    message.event_id.should eq event.id
    message.user_id.should eq organizer.id
    message.content.should eq "Looking forward to seeing everyone!"
  end

  it "allows guests to view event messages" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    EventMessageFactory.create &.event_id(event.id).user_id(organizer.id).content("Message 1")
    EventMessageFactory.create &.event_id(event.id).user_id(organizer.id).content("Message 2")
    EventMessageFactory.create &.event_id(event.id).user_id(organizer.id).content("Message 3")

    EventMessageQuery.new.event_id(event.id).select_count.should eq 3
  end

  it "creates notification for task assignment" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id)

    task = TaskFactory.create &.event_id(event.id).guest_id(guest.id)

    notification = NotificationFactory.create &.user_id(guest_user.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::TaskAssigned)
      .title("Task Assigned")
      .message("You've been assigned: #{task.name}")

    notification.notification_type.should eq Notification::NotificationType::TaskAssigned
    notification.user_id.should eq guest_user.id
  end

  it "creates notification for event reminder" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).start_at(2.days.from_now)
    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id)

    notification = NotificationFactory.create &.user_id(guest_user.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::EventReminder)
      .title("Event Reminder")
      .message("#{event.name} is coming up in 2 days!")
      .scheduled_for(1.day.from_now)

    notification.notification_type.should eq Notification::NotificationType::EventReminder
    notification.scheduled_for.should_not be_nil
  end

  it "tracks notification status" do
    user = UserFactory.create
    event = EventFactory.create

    notification = NotificationFactory.create &.user_id(user.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::RsvpReminder)
      .title("RSVP Reminder")
      .message("Please RSVP to the event")
      .status(Notification::Status::Pending)

    notification.status.should eq Notification::Status::Pending

    # Mark as sent
    notification.update!(status: Notification::Status::Sent, sent_at: Time.utc)

    notification.reload
    notification.status.should eq Notification::Status::Sent
    notification.sent_at.should_not be_nil
  end

  it "creates notification for task reassignment" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    old_guest_user = UserFactory.create
    old_guest = GuestFactory.create &.user_id(old_guest_user.id).event_id(event.id)

    new_guest_user = UserFactory.create
    new_guest = GuestFactory.create &.user_id(new_guest_user.id).event_id(event.id)

    task = TaskFactory.create &.event_id(event.id).guest_id(old_guest.id)

    # Reassign task
    task.update!(guest_id: new_guest.id)

    # Create notification for new assignee
    notification = NotificationFactory.create &.user_id(new_guest_user.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::TaskReassigned)
      .title("Task Reassigned")
      .message("Task '#{task.name}' has been assigned to you")

    notification.notification_type.should eq Notification::NotificationType::TaskReassigned
    notification.user_id.should eq new_guest_user.id
  end

  it "creates notification for event date change" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).start_at(1.week.from_now)

    guest1 = UserFactory.create
    guest2 = UserFactory.create
    GuestFactory.create &.user_id(guest1.id).event_id(event.id).status(Guest::Status::Confirmed)
    GuestFactory.create &.user_id(guest2.id).event_id(event.id).status(Guest::Status::Confirmed)

    # Change event date
    new_date = 2.weeks.from_now
    event.update!(start_at: new_date)

    # Create notifications for all confirmed guests
    NotificationFactory.create &.user_id(guest1.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::EventDateChanged)
      .title("Event Date Changed")
      .message("The event date has been changed")

    NotificationFactory.create &.user_id(guest2.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::EventDateChanged)
      .title("Event Date Changed")
      .message("The event date has been changed")

    NotificationQuery.new.event_id(event.id)
      .notification_type(Notification::NotificationType::EventDateChanged)
      .select_count.should eq 2
  end

  it "complete messaging workflow for event coordination" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id).start_at(1.week.from_now)

    guest1 = UserFactory.create
    guest2 = UserFactory.create
    guest3 = UserFactory.create

    GuestFactory.create &.user_id(guest1.id).event_id(event.id).status(Guest::Status::Confirmed)
    GuestFactory.create &.user_id(guest2.id).event_id(event.id).status(Guest::Status::Confirmed)
    GuestFactory.create &.user_id(guest3.id).event_id(event.id).status(Guest::Status::NoAnswer)

    # Organizer sends initial message
    EventMessageFactory.create &.event_id(event.id)
      .user_id(organizer.id)
      .content("Welcome everyone! Event details coming soon.")

    # Guest responds
    EventMessageFactory.create &.event_id(event.id)
      .user_id(guest1.id)
      .content("Thanks! Can't wait!")

    # Organizer sends updates
    EventMessageFactory.create &.event_id(event.id)
      .user_id(organizer.id)
      .content("Final headcount is 15 people!")

    # Verify messages
    EventMessageQuery.new.event_id(event.id).select_count.should eq 3

    # Send RSVP reminder to pending guest
    NotificationFactory.create &.user_id(guest3.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::RsvpReminder)
      .title("RSVP Reminder")
      .message("Please RSVP to #{event.name}")

    # Send event reminders to confirmed guests
    NotificationFactory.create &.user_id(guest1.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::EventReminder)
      .title("Event Tomorrow")
      .message("#{event.name} is tomorrow!")
      .scheduled_for(1.day.from_now)

    NotificationFactory.create &.user_id(guest2.id)
      .event_id(event.id)
      .notification_type(Notification::NotificationType::EventReminder)
      .title("Event Tomorrow")
      .message("#{event.name} is tomorrow!")
      .scheduled_for(1.day.from_now)

    # Verify notifications
    NotificationQuery.new.event_id(event.id).select_count.should eq 3
    NotificationQuery.new.event_id(event.id)
      .notification_type(Notification::NotificationType::EventReminder)
      .select_count.should eq 2
  end

  it "allows filtering notifications by type" do
    user = UserFactory.create
    event = EventFactory.create

    NotificationFactory.create &.user_id(user.id).event_id(event.id)
      .notification_type(Notification::NotificationType::TaskAssigned)
      .title("Task").message("Task assigned")

    NotificationFactory.create &.user_id(user.id).event_id(event.id)
      .notification_type(Notification::NotificationType::EventReminder)
      .title("Reminder").message("Event reminder")

    NotificationFactory.create &.user_id(user.id).event_id(event.id)
      .notification_type(Notification::NotificationType::EventReminder)
      .title("Reminder 2").message("Event reminder 2")

    NotificationQuery.new.user_id(user.id)
      .notification_type(Notification::NotificationType::EventReminder)
      .select_count.should eq 2
  end
end
