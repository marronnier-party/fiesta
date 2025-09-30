class SecretSanta::Enable < BrowserAction
  post "/events/:event_id/secret_santa/enable" do
    event = EventQuery.find(event_id)

    # Only allow creator to enable Secret Santa
    unless event.creator_id == current_user.id
      flash.failure = r("errors.unauthorized").t
      redirect to: Events::Show.with(event.id)
    end

    # Check if Secret Santa already exists
    existing = SecretSantaQuery.new.for_event(event).first?

    if existing
      flash.info = r("secret_santa.enabled").t
      redirect to: SecretSanta::Show.with(event.id)
    end

    # Create Secret Santa for this event
    SaveSecretSanta.create(event_id: event.id) do |operation, secret_santa|
      if secret_santa
        flash.success = r("secret_santa.enabled").t
        redirect to: SecretSanta::Show.with(event.id)
      else
        flash.failure = r("errors.invalid").t
        redirect to: Events::Show.with(event.id)
      end
    end
  end
end
