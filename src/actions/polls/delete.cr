class Polls::Delete < BrowserAction
  delete "/polls/:poll_id" do
    poll = PollQuery.new.preload_event.find(poll_id)
    event = poll.event!

    # Only event creator can delete polls
    if event.creator_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Events::Show.with(event.id)
    end

    poll.delete

    flash.success = r("polls.deleted").t
    redirect to: Events::Show.with(event.id)
  end
end
