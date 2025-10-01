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
    column cost : Float64?

    belongs_to event : Event
    belongs_to guest : Guest?
  end

  def comments
    CommentQuery.new.for_task(self).preload_user.recent.results
  end
end
