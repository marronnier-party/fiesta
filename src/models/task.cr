class Task < BaseModel
  enum Status
    Pending
    InProgress
    Completed
    Cancelled
  end

  table do
    column name : String
    column status : Task::Status = Task::Status::Pending
    column completed_at : Time?
    column position : Int32 = 0
    column category : String?
    column notes : String?

    belongs_to event : Event
    belongs_to guest : Guest?
  end
end
