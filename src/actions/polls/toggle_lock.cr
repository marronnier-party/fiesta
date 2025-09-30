class Polls::ToggleLock < BrowserAction
  post "/polls/:poll_id/toggle_lock" do
    poll = PollQuery.new.preload_event.find(poll_id)

    # Only event creator can lock/unlock polls
    if poll.event!.creator_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Polls::Show.with(poll.id)
    end

    SavePoll.update(poll, is_locked: !poll.is_locked) do |operation, updated_poll|
      if operation.saved?
        if updated_poll.is_locked
          flash.success = r("polls.locked").t
        else
          flash.success = r("polls.unlocked").t
        end
        redirect to: Polls::Show.with(poll.id)
      else
        flash.failure = r("polls.lock_failed").t
        redirect to: Polls::Show.with(poll.id)
      end
    end
  end
end
