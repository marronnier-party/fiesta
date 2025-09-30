class Polls::Vote < BrowserAction
  post "/polls/:poll_id/vote" do
    poll = PollQuery.new.find(poll_id)

    # Check if poll is locked
    if poll.is_locked
      flash.failure = r("polls.poll_locked").t
      return redirect to: Polls::Show.with(poll.id)
    end

    # Check if user has access
    event = poll.event!
    guest = GuestQuery.new
      .for_event(event)
      .for_user(current_user)
      .first?

    if guest.nil? && event.creator_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Me::Show
    end

    poll_option_id = params.get("poll_option_id").to_i64

    # Verify option belongs to this poll
    option = PollOptionQuery.new
      .for_poll(poll)
      .find(poll_option_id)

    # Remove previous vote if exists
    existing_vote = PollVoteQuery.new
      .for_poll(poll)
      .for_user(current_user)
      .first?
    existing_vote.try(&.delete)

    # Create new vote
    SavePollVote.create!(
      poll_id: poll.id,
      poll_option_id: option.id,
      user_id: current_user.id
    )

    flash.success = r("polls.voted").t
    redirect to: Polls::Show.with(poll.id)
  end
end
