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
    column description : String?
    column organizer_notes : String?
    column status : Event::Status = Event::Status::Draft
    column start_at : Time?
    column end_at : Time?
    column total_cost : Float64? = 0.0
    column budget : Float64?

    belongs_to creator : User
    belongs_to location : Location?
    has_many guests : Guest
    # has_many tasks : Task

    # has_many comments : Comment
  end

  def actual_cost : Float64
    # Calculate actual cost from completed tasks
    # This would be implemented when tasks have cost tracking
    total_cost || 0.0
  end

  def remaining_budget : Float64?
    if b = budget
      b - actual_cost
    end
  end

  def budget_percentage_used : Float64?
    if b = budget
      return 0.0 if b == 0.0
      (actual_cost / b * 100.0).round(2)
    end
  end
end
