class NotificationService
  # Story 52: Schedule automatic reminders for an event
  def self.schedule_event_reminders(event : Event)
    return unless start_at = event.start_at
    return if start_at < Time.utc  # Past event

    # Get all confirmed guests
    guests = GuestQuery.new
      .for_event(event)
      .confirmed
      .preload_user
      .results

    guests.each do |guest|
      user = guest.user!

      # 1 week before reminder
      one_week_before = start_at - 7.days
      if one_week_before > Time.utc
        create_reminder(
          user: user,
          event: event,
          notification_type: Notification::NotificationType::EventReminder,
          title: "Événement dans une semaine",
          message: "#{event.name} aura lieu dans une semaine, le #{start_at.to_s("%d %B %Y")}",
          scheduled_for: one_week_before
        )
      end

      # 1 day before reminder
      one_day_before = start_at - 1.day
      if one_day_before > Time.utc
        create_reminder(
          user: user,
          event: event,
          notification_type: Notification::NotificationType::EventReminder,
          title: "Événement demain",
          message: "#{event.name} aura lieu demain à #{start_at.to_s("%H:%M")}",
          scheduled_for: one_day_before
        )
      end

      # Event day reminder (2 hours before)
      event_day = start_at - 2.hours
      if event_day > Time.utc
        create_reminder(
          user: user,
          event: event,
          notification_type: Notification::NotificationType::EventReminder,
          title: "Événement aujourd'hui",
          message: "#{event.name} commence à #{start_at.to_s("%H:%M")}",
          scheduled_for: event_day
        )
      end
    end
  end

  # Story 53: Notify when task is assigned
  def self.notify_task_assigned(task : Task, assignee : Guest)
    user = assignee.user!
    event = task.event!

    create_reminder(
      user: user,
      event: event,
      notification_type: Notification::NotificationType::TaskAssigned,
      title: "Nouvelle tâche assignée",
      message: "Vous avez été assigné à la tâche '#{task.name}' pour #{event.name}",
      scheduled_for: Time.utc  # Send immediately
    )
  end

  # Story 53: Notify when task is reassigned
  def self.notify_task_reassigned(task : Task, new_assignee : Guest, old_assignee : Guest?)
    # Notify new assignee
    new_user = new_assignee.user!
    event = task.event!

    create_reminder(
      user: new_user,
      event: event,
      notification_type: Notification::NotificationType::TaskReassigned,
      title: "Tâche réassignée",
      message: "La tâche '#{task.name}' vous a été réassignée pour #{event.name}",
      scheduled_for: Time.utc
    )

    # Notify old assignee if exists
    if old_assignee
      old_user = old_assignee.user!
      create_reminder(
        user: old_user,
        event: event,
        notification_type: Notification::NotificationType::TaskReassigned,
        title: "Tâche réassignée",
        message: "La tâche '#{task.name}' a été réassignée à quelqu'un d'autre",
        scheduled_for: Time.utc
      )
    end
  end

  # Helper method to create a reminder
  private def self.create_reminder(
    user : User,
    event : Event,
    notification_type : Notification::NotificationType,
    title : String,
    message : String,
    scheduled_for : Time
  )
    SaveNotification.create(
      user_id: user.id,
      event_id: event.id,
      notification_type: notification_type,
      title: title,
      message: message,
      scheduled_for: scheduled_for,
      status: Notification::Status::Pending
    )
  end

  # Process pending notifications (would be called by background job)
  def self.process_pending_notifications
    notifications = NotificationQuery.new.due_now.results

    notifications.each do |notification|
      # In a real implementation, this would send an email or push notification
      # For now, just mark as sent
      SaveNotification.update(notification, status: Notification::Status::Sent, sent_at: Time.utc)
    end
  end
end
