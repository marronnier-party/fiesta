class Polls::Show < BrowserAction
  get "/polls/:poll_id" do
    poll = PollQuery.new
      .preload_event
      .preload_poll_options
      .find(poll_id)

    # Check if user has access (must be invited to the event)
    event = poll.event!
    guest = GuestQuery.new
      .for_event(event)
      .for_user(current_user)
      .first?

    if guest.nil? && event.creator_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Me::Show
    end

    # Get user's vote if any
    user_vote = PollVoteQuery.new
      .for_poll(poll)
      .for_user(current_user)
      .first?

    # Get vote counts per option
    options_with_counts = poll.poll_options.map do |option|
      vote_count = PollVoteQuery.new.for_option(option).results.size.to_i64
      {option: option, vote_count: vote_count}
    end

    html Polls::ShowPage,
      poll: poll,
      event: event,
      options_with_counts: options_with_counts,
      user_vote: user_vote
  end
end
