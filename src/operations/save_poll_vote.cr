class SavePollVote < PollVote::SaveOperation
  permit_columns poll_id, poll_option_id, user_id

  before_save do
    validate_required poll_id, poll_option_id, user_id
  end
end
