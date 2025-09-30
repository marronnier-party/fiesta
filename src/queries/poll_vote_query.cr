class PollVoteQuery < PollVote::BaseQuery
  def for_poll(poll : Poll)
    poll_id(poll.id)
  end

  def for_poll(poll_id : Int64)
    poll_id(poll_id)
  end

  def for_user(user : User)
    user_id(user.id)
  end

  def for_user(user_id : Int64)
    user_id(user_id)
  end

  def for_option(option : PollOption)
    poll_option_id(option.id)
  end
end
