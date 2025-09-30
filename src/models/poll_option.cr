class PollOption < BaseModel
  table do
    column option_text : String

    belongs_to poll : Poll
    has_many poll_votes : PollVote
  end

  def vote_count : Int64
    poll_votes.size.to_i64
  end
end
