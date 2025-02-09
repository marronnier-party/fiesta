class Event < BaseModel
  enum Status
    Draft # not public / can't invite guest / no location etc
    # SubmittedForVote
    Confirmed
    Done
    Cancelled
  end
  # soft delete (archived at)
  table do
    column name : String
    column slug : String
    column description : String
    column status : Event::Status = Event::Status::Draft
    column start_at : Time
    column end_at : Time
    column total_cost : Float64 = 0.0

    belongs_to creator : User
    belongs_to location : Location?
    has_many guests : Guest
    # has_many tasks : Task

    # has_many comments : Comment
  end
end
