class Event < BaseModel
  enum Status
    Draft # not public / can't invite guest / no location etc
    # SubmittedForVote
    Confirmed
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

    belongs_to created_by : User
    belongs_to location : Location?
    has_many guests : Guest
    # has_many tasks : Task

    # has_many comments : Comment
  end
end
