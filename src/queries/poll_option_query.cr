class PollOptionQuery < PollOption::BaseQuery
  def for_poll(poll : Poll)
    poll_id(poll.id)
  end

  def for_poll(poll_id : Int64)
    poll_id(poll_id)
  end
end
