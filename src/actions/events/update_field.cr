class Events::UpdateField < BrowserAction
  put "/events/:event_id/field" do
    event = EventQuery.find(event_id)

    # Authorization check
    if event.creator_id != current_user.id
      if htmx_request?
        head 403
      else
        redirect_back fallback: Events::Show.with(event_id)
      end
    else
      # Update the event based on which field was sent
      if name = params.get?("event:name")
        SaveEvent.update!(event, name: name)
      elsif description = params.get?("event:description")
        SaveEvent.update!(event, description: description)
      end

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
end
