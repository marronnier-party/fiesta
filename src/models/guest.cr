class Guest < BaseModel
  enum Status
    NoAnswer
    Confirmed
    Declined
  end

  table do
    belongs_to user : User
    belongs_to event : Event
    column status : Guest::Status = Guest::Status::NoAnswer
  end
end
