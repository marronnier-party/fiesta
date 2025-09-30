class EventActivity < BaseModel
  enum ActivityType
    GuestRsvp
    TaskAssigned
    TaskCompleted
    EventCreated
    EventUpdated
    ReminderSent
    DateChanged
  end

  table do
    column activity_type : String
    column description : String

    belongs_to event : Event
    belongs_to user : User
  end
end
