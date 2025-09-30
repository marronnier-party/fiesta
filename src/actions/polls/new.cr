class Polls::New < BrowserAction
  include RequireEventFromId

  get "/events/:event_id/polls/new" do
    # Only event creator can create polls
    if event.creator_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Events::Show.with(event.id)
    end

    html Polls::NewPage, event: event, save_operation: SavePoll.new
  end
end
