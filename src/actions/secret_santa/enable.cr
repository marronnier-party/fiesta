class SecretSanta::Enable < BrowserAction
  post "/events/:event_id/secret_santa/enable" do
    event = EventQuery.find(event_id)

    # Manual authorization check (Pundit macro has issues with SecretSanta namespace)
    unless EventPolicy.new(current_user, event).update?
      raise Pundit::NotAuthorizedError.new
    end

    # Check if Secret Santa already exists
    existing = SecretSantaQuery.new.for_event(event).first?

    if existing
      flash.info = r("secret_santa.already_enabled").t
      redirect to: SecretSanta::Show.with(event.id)
    else
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
end
