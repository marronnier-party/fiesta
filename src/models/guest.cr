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
    #column total_expenses : Float64 = 0.0
    column answered_at : Time?
    column confirmed_at : Time?
    column declined_at : Time?
    column cancelled_at : Time?

    belongs_to user : User
    belongs_to event : Event
    has_many tasks : Task
    # has_many dependent_guests : DependentGuest
  end
end
