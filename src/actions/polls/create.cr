class Polls::Create < BrowserAction
  include RequireEventFromId

  post "/events/:event_id/polls" do
    # Only event creator can create polls
    if event.creator_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Events::Show.with(event.id)
    end

    SavePoll.create(params, event_id: event.id) do |operation, poll|
      if operation.saved?
        # Create poll options from params
        options = params.get_all("poll_options[]")
        options.each do |option_text|
          next if option_text.strip.empty?
          SavePollOption.create!(poll_id: poll.not_nil!.id, option_text: option_text.strip)
        end

        flash.success = r("polls.created").t
        redirect to: Events::Show.with(event.id)
      else
        flash.failure = r("polls.create_failed").t
        html Polls::NewPage, event: event, save_operation: operation
      end
    end
  end
end
