class Dashboard::ConfirmedEventCard < BaseComponent
  needs guest : Guest

  def render
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-start justify-between mb-4" do
          div class: "flex-1" do
            h3 guest.event!.name, class: "card-title text-2xl"
            para class: "text-sm text-base-content/70 mt-1" do
              text r("events.organized_by").t(name: guest.event!.creator!.name)
            end
          end

          span class: "badge badge-success badge-lg gap-2" do
            icon "check-circle", "w-4 h-4"
            text r("guests.statuses.confirmed").t
          end
        end

        render_event_details
        render_attendees
        render_tasks

        div class: "card-actions justify-end mt-4" do
          link r("events.view_details").t, to: Events::Show.with(guest.event_id), class: "btn btn-primary"
        end
      end
    end
  end

  private def render_event_details
    div class: "space-y-2 mb-4" do
      if start_at = guest.event!.start_at
        div class: "flex items-center gap-2 text-base-content/80" do
          icon "calendar", "w-5 h-5"
          text format_date(start_at)
        end
      end

      if location = guest.event!.location
        div class: "flex items-center gap-2 text-base-content/80" do
          icon "map-pin", "w-5 h-5"
          text location.name
        end
      end
    end
  end

  private def render_attendees
    total = guest.total_attendees

    div class: "flex items-start gap-2 mb-4" do
      icon "users", "w-5 h-5 text-base-content/80 mt-0.5"
      div class: "flex-1" do
        para class: "text-base-content/80" do
          strong class: "text-base-content", text: "Your group: #{total} #{total == 1 ? "person" : "people"}"
        end

        if dependents = guest.dependent_guests
          if dependents.size > 0
            para class: "text-sm text-base-content/60 mt-1" do
              text dependents.map(&.name).join(", ")
            end
          end
        end
      end
    end
  end

  private def render_tasks
    task_count = TaskQuery.new.for_guest(guest).select_count
    return if task_count == 0

    div class: "alert alert-info" do
      icon "clipboard-list", "w-5 h-5"
      span do
        text "You have #{task_count} #{task_count == 1 ? "task" : "tasks"} for this event"
      end
    end
  end


  private def format_date(time : Time)
    time.to_s("%B %-d, %Y at %-I:%M %p")
  end
end
