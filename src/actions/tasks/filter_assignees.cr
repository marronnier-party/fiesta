class Tasks::FilterAssignees < BrowserAction
  get "/events/:event_id/tasks/filter_assignees" do
    event = EventQuery.find(event_id)

    # Authorization check
    if event.creator_id != current_user.id
      return head 403
    end

    # Get filter parameter (could be status, category, etc.)
    status_filter = params.get?("status") || "all"

    # Get guests
    guests = GuestQuery.new.event_id(event_id).preload_user.results

    # Filter guests based on selection
    filtered_guests = case status_filter
    when "confirmed"
      guests.select(&.status.confirmed?)
    when "pending"
      guests.select(&.status.no_answer?)
    else
      guests
    end

    if htmx_request?
      component Tasks::AssigneeOptions, guests: filtered_guests
    else
      head 404
    end
  end
end
