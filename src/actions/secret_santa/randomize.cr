class SecretSanta::Randomize < BrowserAction
  post "/events/:event_id/secret_santa/randomize" do
    event = EventQuery.find(event_id)

    secret_santa = SecretSantaQuery.new.for_event(event).first

    unless secret_santa
      flash.failure = r("errors.not_found").t
      redirect to: Events::Show.with(event.id)
    end

    # Manual authorization check (Pundit macro has issues with compound model names)
    unless SecretSantaPolicy.new(current_user, secret_santa).randomize?
      raise Pundit::NotAuthorizedError.new
    end

    # Get confirmed guests
    participants = GuestQuery.new
      .for_event(event)
      .confirmed
      .results

    if participants.size < 2
      flash.failure = "Need at least 2 confirmed guests for Secret Santa"
      redirect to: SecretSanta::Show.with(event.id)
    end

    if SecretSantaService.randomize_assignments(secret_santa, participants)
      flash.success = r("secret_santa.assignments_created").t
    else
      flash.failure = "Failed to create assignments"
    end

    redirect to: SecretSanta::Show.with(event.id)
  end
end
