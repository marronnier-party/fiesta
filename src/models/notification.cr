class Notification < BaseModel
  enum NotificationType
    EventReminder       # Story 52: Event coming up
    TaskAssigned        # Story 53: Task has been assigned
    TaskReassigned      # Story 53: Task has been reassigned
    EventDateChanged    # Event date was changed
    RsvpReminder        # Reminder to RSVP
  end

  enum Status
    Pending
    Sent
    Failed
  end

  table do
    column notification_type : Notification::NotificationType
    column status : Notification::Status = Notification::Status::Pending
    column title : String
    column message : String
    column scheduled_for : Time?
    column sent_at : Time?

    belongs_to user : User
    belongs_to event : Event?
  end
end
