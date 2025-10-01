class Tasks::FilterAssignees < BrowserAction
  get "/events/:event_id/tasks/filter_assignees" do
    event = EventQuery.find(event_id)

    # Authorization check
    unless event.creator_id == current_user.id
      head 403
      return
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
      # Return just the options HTML
      html_string do
        tag "option", value: "", disabled: true, selected: true do
          text r("tasks.select_assignee").t
        end

        if filtered_guests.empty?
          tag "option", value: "", disabled: true do
            text r("tasks.no_assignees_available").t
          end
        else
          filtered_guests.each do |guest|
            tag "option", value: guest.id.to_s do
              status_emoji = case guest.status
              when Guest::Status::Confirmed
                "✓"
              when Guest::Status::NoAnswer
                "?"
              else
                "✗"
              end
              text "#{status_emoji} #{guest.user!.name}"
            end
          end
        end
      end
    else
      head 404
    end
  end
end
