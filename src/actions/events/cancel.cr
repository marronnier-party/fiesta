class Events::Cancel < BrowserAction
  include Auth::RequireSignIn
  include RequireEventFromId
  include RequireEventOwnership
  include Rosetta::Translatable

  post "/events/:event_id/cancel" do
    SaveEvent.update(event, status: Event::Status::Cancelled) do |operation, updated_event|
      if updated_event
        flash.success = r("events.cancelled_successfully").t
        redirect to: Events::Show.with(event.id)
      else
        flash.failure = r("events.cancel_failed").t
        redirect to: Events::Show.with(event.id)
      end
    end
  end
end
