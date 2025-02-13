class Events::Wizard::Create < BrowserAction
  include Auth::RequireSignIn

  param current_step : Int32
  param event_id : UUID?

  post "/events/wizard/create" do
    case current_step
    when 1
      create_event
    when 2
      update_event_dates
    when 3
      update_event_location
    when 4
      update_event_description
    when 5
      finalize_event
    else
      html_with_error("Étape invalide")
    end
  end

  private def create_event
    SaveEvent.create(params, current_user) do |operation, event|
      if operation.saved?
        html Events::Wizard,
          current_step: 2,
          event: event,
          location: nil,
          current_user: current_user
      else
        html Events::Wizard,
          current_step: 1,
          event: operation.event,
          location: nil,
          current_user: current_user
      end
    end
  end

  private def update_event_dates
    event = EventQuery.find(event_id)
    SaveEvent.update(event, params) do |operation, updated_event|
      if operation.saved?
        html Events::Wizard,
          current_step: 3,
          event: updated_event,
          location: updated_event.location,
          current_user: current_user
      else
        html Events::Wizard,
          current_step: 2,
          event: operation.event,
          location: event.location,
          current_user: current_user
      end
    end
  end

  private def update_event_location
    event = EventQuery.find(event_id)
    SaveEvent.update(event, params) do |operation, updated_event|
      if operation.saved?
        html Events::Wizard,
          current_step: 4,
          event: updated_event,
          location: updated_event.location,
          current_user: current_user
      else
        html Events::Wizard,
          current_step: 3,
          event: operation.event,
          location: event.location,
          current_user: current_user
      end
    end
  end

  private def update_event_description
    event = EventQuery.find(event_id)
    SaveEvent.update(event, params) do |operation, updated_event|
      if operation.saved?
        html Events::Wizard,
          current_step: 5,
          event: updated_event,
          location: updated_event.location,
          current_user: current_user
      else
        html Events::Wizard,
          current_step: 4,
          event: operation.event,
          location: event.location,
          current_user: current_user
      end
    end
  end

  private def finalize_event
    event = EventQuery.find(event_id)
    SaveEvent.update(event, status: Event::Status::Confirmed) do |operation, updated_event|
      if operation.saved?
        response.headers["HX-Redirect"] = Events::Show.with(event_id: updated_event.id).path
        html ""
      else
        html Events::Wizard,
          current_step: 5,
          event: operation.event,
          location: event.location,
          current_user: current_user
      end
    end
  end
end
