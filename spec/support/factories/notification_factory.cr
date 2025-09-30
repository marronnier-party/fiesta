class NotificationFactory < Avram::Factory
  def initialize
    notification_type Notification::NotificationType::EventReminder
    status Notification::Status::Pending
    title "Test Notification"
    message "This is a test notification"
    scheduled_for Time.utc
    user_id UserFactory.create.id
    event_id EventFactory.create.id
  end
end
