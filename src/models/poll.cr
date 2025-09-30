class Poll < BaseModel
  table do
    column question : String
    column is_locked : Bool = false

    belongs_to event : Event
    has_many poll_options : PollOption
    has_many poll_votes : PollVote
  end

  def total_votes : Int64
    poll_votes.size.to_i64
  end
end
