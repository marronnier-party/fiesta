class Guest < BaseModel
  enum Status
    NoAnswer
    Confirmed
    Declined
    Attended
    Cancelled
  end

  table do
    column status : Guest::Status = Guest::Status::NoAnswer
    column guest_count : Int32 = 1
    column notes : String?
    column answered_at : Time?
    column confirmed_at : Time?
    column declined_at : Time?
    column cancelled_at : Time?

    belongs_to user : User
    belongs_to event : Event
    has_many tasks : Task
    has_many dependent_guests : DependentGuest
  end

  def total_attendees
    1 + dependent_guests.size  # Guest + their dependents
  end
end
