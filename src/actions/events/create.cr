class Events::Create < BrowserAction
  param current_step : Int32
  param event_id : UUID?

  post "/events/create" do
    case current_step
    when 1
      event = create_event
      redirect to: Events::New.with(current_step: 2, event_id: event.id)
    when 2
      update_event_dates
      redirect to: Events::New.with(current_step: 3, event_id: event_id)
    when 3
      create_or_update_location
      redirect to: Events::New.with(current_step: 4, event_id: event_id)
    when 4
      update_event_description
      redirect to: Events::Show.with(event_id: event_id)
    else
      redirect to: Events::New
    end
  end

  private def create_event
    SaveEvent.create!(
      creator: current_user,
      name: params.get("event:name"),
      status: Event::Status::Draft,
      start_at: Time.utc,
      end_at: Time.utc
    )
  end

  private def update_event_dates
    SaveEvent.update!(
      event_id,
      start_at: Time.parse(params.get("event:start_at"), "%Y-%m-%dT%H:%M", Time::Location::UTC),
      end_at: Time.parse(params.get("event:end_at"), "%Y-%m-%dT%H:%M", Time::Location::UTC)
    )
  end

  private def create_or_update_location
    location = SaveLocation.create!(
      creator: current_user,
      name: params.get("location:name"),
      address: params.get("location:address"),
      city: params.get("location:city"),
      postal_code: params.get("location:postal_code"),
      country: params.get("location:country")
    )

    SaveEvent.update!(event_id, location_id: location.id)
  end

  private def update_event_description
    SaveEvent.update!(event_id, description: params.get("event:description"))
  end
end
