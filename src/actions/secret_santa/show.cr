class SecretSanta::Show < BrowserAction
  get "/events/:event_id/secret_santa" do
    event = EventQuery.new.preload_creator.find(event_id)

    # Check authorization
    unless event.creator_id == current_user.id
      # Check if user is a confirmed guest
      user_guest = GuestQuery.new
        .for_event(event)
        .user_id(current_user.id)
        .first?

      unless user_guest && user_guest.status.confirmed?
        flash.failure = r("errors.unauthorized").t
        redirect to: Events::Show.with(event.id)
      end
    end

    secret_santa = SecretSantaQuery.new.for_event(event).first

    unless secret_santa
      flash.failure = r("errors.not_found").t
      redirect to: Events::Show.with(event.id)
    end

    # Get all assignments
    assignments = SecretSantaAssignmentQuery.new
      .for_secret_santa(secret_santa)
      .preload_giver
      .preload_receiver
      .results

    # Get user's assignment if they're a participant
    user_guest = GuestQuery.new
      .for_event(event)
      .user_id(current_user.id)
      .first?

    my_assignment = if user_guest
                      assignments.find { |a| a.giver_id == user_guest.id }
                    end

    # Get all confirmed guests for organizer view
    guests = GuestQuery.new
      .for_event(event)
      .confirmed
      .preload_user
      .results

    html ShowPage,
      event: event,
      secret_santa: secret_santa,
      assignments: assignments,
      my_assignment: my_assignment,
      guests: guests,
      is_organizer: event.creator_id == current_user.id
  end
end
