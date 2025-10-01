class Events::UpdateField < BrowserAction
  put "/events/:event_id/field" do
    event = EventQuery.find(event_id)

    # Authorization check
    unless event.creator_id == current_user.id
      if htmx_request?
        head 403
      else
        redirect_back fallback: Events::Show.with(event_id)
      end
      return
    end

    # Determine which field to update based on params
    updates = {} of Symbol => String | Time

    if name = params.get?("event:name")
      updates[:name] = name
    end

    if description = params.get?("event:description")
      updates[:description] = description
    end

    if location = params.get?("event:location")
      updates[:location] = location
    end

    # Update the event
    SaveEvent.update!(event, **updates)

    if htmx_request?
      # Return success with header
      context.response.headers["X-Success-Message"] = "Event updated"
      head 200
    else
      flash.success = "Event updated successfully"
      redirect to: Events::Show.with(event_id)
    end
  end
end
