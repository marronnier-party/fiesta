class Events::IndexPage < MainLayout
  needs events : Array(Event)
  needs search_query : String?
  needs view_mode : String

  def page_title
    r("events.my_events").t
  end

  def content
    div class: "space-y-6" do
      render_header
      render_view_mode_toggle
      render_search

      if view_mode == "timeline"
        render_timeline_view
      else
        render_events_list
      end
    end
  end

  private def render_search
    form method: "get", action: Events::Index.path, class: "max-w-md" do
      div class: "form-control" do
        div class: "input-group" do
          input type: "text", name: "search", value: search_query || "", placeholder: r("events.search_placeholder").t, class: "input input-bordered w-full"
          button type: "submit", class: "btn btn-square" do
            icon "search", "w-5 h-5"
          end
        end
      end
    end
  end

  private def render_header
    div class: "flex items-center justify-between" do
      h1 r("events.my_events").t, class: "text-3xl font-bold"
      link to: Events::New, class: "btn btn-primary" do
        icon "plus", "w-5 h-5 mr-2"
        text r("nav.create_event").t
      end
    end
  end

  private def render_events_list
    if events.empty?
      render_empty_state
    else
      div class: "grid grid-cols-1 gap-4" do
        events.each do |event|
          render_event_card(event)
        end
      end
    end
  end

  private def render_empty_state
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body items-center text-center py-12" do
        div class: "bg-base-300 rounded-full p-6 mb-4" do
          icon "calendar", "w-16 h-16 text-base-content/40"
        end
        h2 r("events.no_events").t, class: "card-title text-2xl mb-2"
        para r("events.no_events_hint").t, class: "text-base-content/70 mb-6"
        link r("nav.create_event").t, to: Events::New, class: "btn btn-primary btn-lg"
      end
    end
  end

  private def render_event_card(event : Event)
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-start justify-between" do
          div class: "flex-1" do
            h3 event.name, class: "card-title text-2xl"

            div class: "space-y-2 mt-4" do
              if start_at = event.start_at
                div class: "flex items-center gap-2 text-base-content/80" do
                  icon "calendar", "w-5 h-5"
                  text format_date(start_at)
                end
              end

              if location = event.location
                div class: "flex items-center gap-2 text-base-content/80" do
                  icon "map-pin", "w-5 h-5"
                  text location.name
                end
              end
            end
          end

          render_status_badge(event)
        end

        div class: "card-actions justify-end mt-4" do
          link r("events.view_details").t, to: Events::Show.with(event.id), class: "btn btn-ghost"
          link r("actions.edit").t, to: Events::Edit.with(event.id), class: "btn btn-primary"
        end
      end
    end
  end

  private def render_status_badge(event : Event)
    case event.status
    when Event::Status::Draft
      span r("events.statuses.draft").t, class: "badge badge-warning"
    when Event::Status::Confirmed
      span r("events.statuses.confirmed").t, class: "badge badge-success"
    when Event::Status::Cancelled
      span r("events.statuses.cancelled").t, class: "badge badge-error"
    when Event::Status::Done
      span r("tasks.statuses.completed").t, class: "badge badge-ghost"
    end
  end

  private def render_view_mode_toggle
    div class: "flex gap-2" do
      a r("timeline.list_view").t, href: Events::Index.path + "?view=list",
        class: "btn btn-sm #{view_mode == "list" ? "btn-primary" : "btn-ghost"}"
      a r("timeline.view").t, href: Events::Index.path + "?view=timeline",
        class: "btn btn-sm #{view_mode == "timeline" ? "btn-primary" : "btn-ghost"}"
    end
  end

  private def render_timeline_view
    if events.empty?
      render_empty_state
      return
    end

    # Group events by month
    events_by_month = events.group_by do |event|
      if start_at = event.start_at
        {start_at.year, start_at.month}
      else
        {0, 0}  # Events without date
      end
    end

    div class: "space-y-8" do
      events_by_month.each do |(year, month), month_events|
        if year == 0
          render_month_section("No Date", month_events)
        else
          month_name = Time.utc(year, month, 1).to_s("%B %Y")
          render_month_section(month_name, month_events)
        end
      end
    end
  end

  private def render_month_section(title : String, month_events : Array(Event))
    div class: "space-y-4" do
      h2 title, class: "text-2xl font-bold sticky top-0 bg-base-100 py-2 z-10"

      div class: "space-y-3 pl-8 border-l-4 border-primary" do
        month_events.each do |event|
          render_timeline_event(event)
        end
      end
    end
  end

  private def render_timeline_event(event : Event)
    div class: "relative" do
      # Timeline dot
      div class: "absolute -left-10 top-2 w-4 h-4 bg-primary rounded-full border-4 border-base-100"

      div class: "card bg-base-100 shadow-md hover:shadow-lg transition-shadow" do
        div class: "card-body p-4" do
          div class: "flex items-start justify-between" do
            div class: "flex-1" do
              h3 do
                link event.name, to: Events::Show.with(event.id), class: "font-semibold text-lg hover:text-primary"
              end

              if start_at = event.start_at
                div class: "text-sm text-base-content/60 mt-1" do
                  icon "clock", "w-4 h-4 inline"
                  text " " + start_at.to_s("%-d %B, %-I:%M %p")
                end
              end

              if location = event.location
                div class: "text-sm text-base-content/60 mt-1" do
                  icon "map-pin", "w-4 h-4 inline"
                  text " " + location.name
                end
              end
            end

            render_status_badge(event)
          end
        end
      end
    end
  end

  private def format_date(time : Time)
    time.to_s("%B %-d, %Y at %-I:%M %p")
  end
end
