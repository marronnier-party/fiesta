class PollVote < BaseModel
  table do
    belongs_to poll : Poll
    belongs_to poll_option : PollOption
    belongs_to user : User
  end
end
