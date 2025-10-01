class Events::GuestStats < BrowserAction
  get "/events/:event_id/guest_stats" do
    event = EventQuery.find(event_id)
    guests = GuestQuery.new.event_id(event_id).preload_user.results

    # Authorization check
    if event.creator_id != current_user.id && !guests.any? { |g| g.user_id == current_user.id }
      head 403
    elsif htmx_request?
      # Calculate stats
      confirmed = guests.count { |g| g.status == Guest::Status::Confirmed }
      pending = guests.count { |g| g.status == Guest::Status::NoAnswer }
      declined = guests.count { |g| g.status == Guest::Status::Declined }

      # Render just the stats widget
      component UI::StatsWidget, stats: [
        UI::StatsWidget::Stat.new(
          title: r("events.confirmed_count").t(count: confirmed),
          value: confirmed.to_s,
          color: "text-success"
        ),
        UI::StatsWidget::Stat.new(
          title: r("events.pending_count").t(count: pending),
          value: pending.to_s,
          color: "text-warning"
        ),
        UI::StatsWidget::Stat.new(
          title: r("events.declined_count").t(count: declined),
          value: declined.to_s,
          color: "text-error"
        )
      ]
    else
      head 404
    end
  end
end
