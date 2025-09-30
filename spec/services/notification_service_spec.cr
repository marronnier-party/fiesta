require "../spec_helper"

describe NotificationService do
  describe ".schedule_event_reminders" do
    it "creates reminders for confirmed guests" do
      setup = create_upcoming_event(10)
      guest_user = UserFactory.create
      GuestFactory.create &.event_id(setup[:event].id)
        .user_id(guest_user.id)
        .status(Guest::Status::Confirmed)

      NotificationService.schedule_event_reminders(setup[:event])

      notifications = NotificationQuery.new
        .for_user(guest_user)
        .for_event(setup[:event])
        .results

      notifications.size.should be > 0
    end

    it "creates 1-week reminder" do
      setup = create_upcoming_event(10)
      guest_user = UserFactory.create
      GuestFactory.create &.event_id(setup[:event].id)
        .user_id(guest_user.id)
        .status(Guest::Status::Confirmed)

      NotificationService.schedule_event_reminders(setup[:event])

      notifications = NotificationQuery.new
        .for_user(guest_user)
        .results

      week_reminder = notifications.find { |n| n.title.includes?("semaine") }
      week_reminder.should_not be_nil
    end

    it "does not create reminders for past events" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
        .start_at(Time.utc - 1.day)

      event = EventQuery.find(event.id)
      NotificationService.schedule_event_reminders(event)

      notifications = NotificationQuery.new.for_event(event).results
      notifications.size.should eq(0)
    end

    it "does not create reminders for events without start date" do
      setup = create_event_with_guests(2)

      NotificationService.schedule_event_reminders(setup[:event])

      notifications = NotificationQuery.new.for_event(setup[:event]).results
      notifications.size.should eq(0)
    end

    it "schedules reminders for future dates" do
      setup = create_upcoming_event(10)
      guest_user = UserFactory.create
      GuestFactory.create &.event_id(setup[:event].id)
        .user_id(guest_user.id)
        .status(Guest::Status::Confirmed)

      NotificationService.schedule_event_reminders(setup[:event])

      notifications = NotificationQuery.new
        .for_user(guest_user)
        .results

      notifications.all? { |n| n.scheduled_for.not_nil! > Time.utc - 1.minute }.should be_true
    end
  end

  describe ".notify_task_assigned" do
    it "creates notification for assignee" do
      setup = create_event_with_guests(1)
      guest = setup[:guests].first
      task = TaskFactory.create &.event_id(setup[:event].id)
        .guest_id(guest.id)
        .name("Bring drinks")

      NotificationService.notify_task_assigned(task, guest)

      notifications = NotificationQuery.new
        .for_user(guest.user!)
        .results

      notifications.size.should eq(1)
      notifications.first.title.should contain("tâche")
    end

    it "sets notification type to TaskAssigned" do
      setup = create_event_with_guests(1)
      guest = setup[:guests].first
      task = TaskFactory.create &.event_id(setup[:event].id).guest_id(guest.id)

      NotificationService.notify_task_assigned(task, guest)

      notification = NotificationQuery.new.for_user(guest.user!).first
      notification.notification_type.should eq(Notification::NotificationType::TaskAssigned)
    end

    it "schedules notification immediately" do
      setup = create_event_with_guests(1)
      guest = setup[:guests].first
      task = TaskFactory.create &.event_id(setup[:event].id).guest_id(guest.id)

      NotificationService.notify_task_assigned(task, guest)

      notification = NotificationQuery.new.for_user(guest.user!).first
      notification.scheduled_for.not_nil!.should be_close(Time.utc, 5.seconds)
    end
  end

  describe ".notify_task_reassigned" do
    it "notifies new assignee" do
      setup = create_event_with_guests(2)
      new_guest = setup[:guests].first
      task = TaskFactory.create &.event_id(setup[:event].id)

      NotificationService.notify_task_reassigned(task, new_guest, nil)

      notifications = NotificationQuery.new.for_user(new_guest.user!).results
      notifications.size.should eq(1)
    end

    it "notifies old assignee when provided" do
      setup = create_event_with_guests(2)
      old_guest = setup[:guests].first
      new_guest = setup[:guests].last
      task = TaskFactory.create &.event_id(setup[:event].id)

      NotificationService.notify_task_reassigned(task, new_guest, old_guest)

      old_notifications = NotificationQuery.new.for_user(old_guest.user!).results
      new_notifications = NotificationQuery.new.for_user(new_guest.user!).results

      old_notifications.size.should eq(1)
      new_notifications.size.should eq(1)
    end
  end

  describe ".process_pending_notifications" do
    it "marks due notifications as sent" do
      user = UserFactory.create
      event = EventFactory.create
      NotificationFactory.create &.user_id(user.id)
        .event_id(event.id)
        .scheduled_for(Time.utc - 1.minute)
        .status(Notification::Status::Pending)

      NotificationService.process_pending_notifications

      notifications = NotificationQuery.new.for_user(user).results
      notifications.first.status.should eq(Notification::Status::Sent)
    end

    it "does not process future notifications" do
      user = UserFactory.create
      event = EventFactory.create
      NotificationFactory.create &.user_id(user.id)
        .event_id(event.id)
        .scheduled_for(Time.utc + 1.hour)
        .status(Notification::Status::Pending)

      NotificationService.process_pending_notifications

      notifications = NotificationQuery.new.for_user(user).results
      notifications.first.status.should eq(Notification::Status::Pending)
    end

    it "sets sent_at timestamp" do
      user = UserFactory.create
      event = EventFactory.create
      NotificationFactory.create &.user_id(user.id)
        .event_id(event.id)
        .scheduled_for(Time.utc - 1.minute)

      NotificationService.process_pending_notifications

      notification = NotificationQuery.new.for_user(user).first
      notification.sent_at.should_not be_nil
    end
  end
end
