class Events::Wizard::GoToStep < BrowserAction
  include Auth::RequireSignIn

  param current_step : Int32

  get "/events/wizard/go-to-step/:event_id" do
    event = EventQuery.find(event_id)

    # Verify user owns the event
    if event.creator_id != current_user.id
      raise Lucky::ForbiddenError.new("Not authorized to access this event")
    end

    location = event.location # Assuming you have this relation set up

    if htmx?
      component Events::Wizard::Creation.new(
        current_step: current_step,
        event: event,
        location: location,
        current_user: current_user
      )
    else
      redirect to: Events::Wizard::New.with(
        current_step: current_step,
        event_id: event.id
      )
    end
  end
end
