class SaveNotification < Notification::SaveOperation
  permit_columns :notification_type, :status, :title, :message, :scheduled_for, :sent_at, :user_id, :event_id

  before_save do
    validate_required notification_type, title, message, user_id
  end
end
