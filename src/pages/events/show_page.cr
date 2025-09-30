class Events::ShowPage < MainLayout
  needs event : Event
  needs guests : Array(Guest)
  needs tasks : Array(Task)
  needs user_guest : Guest?

  def page_title
    event.name
  end

  def content
    div class: "space-y-6" do
      render_event_header

      div class: "grid grid-cols-1 lg:grid-cols-3 gap-6" do
        div class: "lg:col-span-2 space-y-6" do
          render_event_details
          render_tasks_section
        end

        div class: "space-y-6" do
          render_guest_stats
          render_guest_list
        end
      end
    end
  end

  private def render_event_header
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-start justify-between" do
          div class: "flex-1" do
            h1 event.name, class: "card-title text-4xl mb-2"
            para r("events.organized_by").t(name: event.creator!.name), class: "text-base-content/70"
          end

          render_status_badge
        end

        if is_organizer?
          div class: "card-actions justify-end mt-4 gap-2" do
            link r("events.invite_guests").t, to: Events::InviteGuests.with(event.id), class: "btn btn-primary"
            link r("events.add_task").t, to: Events::AddTask.with(event.id), class: "btn btn-secondary"
            link r("actions.edit").t, to: Events::Edit.with(event.id), class: "btn btn-ghost"

            # Only show cancel button if event is not already cancelled
            unless event.status == Event::Status::Cancelled
              form_for Events::Cancel.with(event.id), class: "inline" do
                button r("events.cancel_event").t, type: "submit", class: "btn btn-error btn-outline", data_confirm: r("events.cancel_confirm").t
              end
            end
          end
        end
      end
    end
  end

  private def render_event_details
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 r("events.show").t, class: "card-title text-2xl mb-4"

        div class: "space-y-4" do
          if description = event.description
            div do
              label r("events.description").t, class: "font-semibold"
              para description, class: "text-base-content/80 mt-1"
            end
          end

          if start_at = event.start_at
            div class: "flex items-center gap-3" do
              icon "calendar", "w-6 h-6 text-primary"
              div do
                label r("events.start_at").t, class: "font-semibold block"
                span format_datetime(start_at), class: "text-base-content/80"
              end
            end
          end

          if end_at = event.end_at
            div class: "flex items-center gap-3" do
              icon "calendar", "w-6 h-6 text-primary"
              div do
                label r("events.end_at").t, class: "font-semibold block"
                span format_datetime(end_at), class: "text-base-content/80"
              end
            end
          end

          if location = event.location
            div class: "flex items-start gap-3" do
              icon "map-pin", "w-6 h-6 text-primary"
              div do
                label r("events.location").t, class: "font-semibold block"
                span location.name, class: "text-base-content/80"
                if address = location.address
                  para [address, location.city, location.postal_code].compact.join(", "), class: "text-sm text-base-content/60"
                end
              end
            end
          end
        end

        # Show RSVP button for invited guests
        unless is_organizer?
          if ug = user_guest
            if ug.status == Guest::Status::NoAnswer
              div class: "mt-6" do
                link r("guests.rsvp_now").t, to: Guests::Rsvp.with(ug.id), class: "btn btn-primary btn-block"
              end
            end
          end
        end
      end
    end
  end

  private def render_guest_stats
    confirmed = guests.count { |g| g.status == Guest::Status::Confirmed }
    pending = guests.count { |g| g.status == Guest::Status::NoAnswer }
    declined = guests.count { |g| g.status == Guest::Status::Declined }

    div class: "stats shadow w-full" do
      div class: "stat" do
        div class: "stat-title" do
          text r("events.confirmed_count").t(count: confirmed)
        end
        div confirmed.to_s, class: "stat-value text-success"
      end

      div class: "stat" do
        div class: "stat-title" do
          text r("events.pending_count").t(count: pending)
        end
        div pending.to_s, class: "stat-value text-warning"
      end

      div class: "stat" do
        div class: "stat-title" do
          text r("events.declined_count").t(count: declined)
        end
        div declined.to_s, class: "stat-value text-error"
      end
    end
  end

  private def render_guest_list
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 r("events.guest_list").t, class: "card-title text-2xl mb-4"

        div class: "space-y-2" do
          guests.each do |guest|
            render_guest_item(guest)
          end
        end
      end
    end
  end

  private def render_guest_item(guest : Guest)
    div class: "flex items-center justify-between p-3 bg-base-200 rounded-lg" do
      div class: "flex items-center gap-3" do
        div class: "avatar placeholder" do
          div class: "bg-neutral text-neutral-content rounded-full w-10" do
            span class: "text-xs" do
              text guest.user!.name.split.map(&.[0]).join.upcase[0..1]
            end
          end
        end

        div do
          div guest.user!.name, class: "font-semibold"
          if guest.guest_count > 1
            small "(+#{guest.guest_count - 1})", class: "text-sm text-base-content/60"
          end
        end
      end

      render_guest_status_badge(guest)
    end
  end

  private def render_guest_status_badge(guest : Guest)
    case guest.status
    when Guest::Status::Confirmed
      span r("guests.statuses.confirmed").t, class: "badge badge-success"
    when Guest::Status::NoAnswer
      span r("guests.statuses.pending").t, class: "badge badge-warning"
    when Guest::Status::Declined
      span r("guests.statuses.declined").t, class: "badge badge-error"
    else
      span r("guests.statuses.pending").t, class: "badge badge-ghost"
    end
  end

  private def render_tasks_section
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center justify-between mb-4" do
          h2 r("events.task_list").t, class: "card-title text-2xl"

          if is_organizer?
            link r("events.add_task").t, to: Events::AddTask.with(event.id), class: "btn btn-sm btn-primary"
          end
        end

        if tasks.empty?
          div class: "text-center py-8 text-base-content/60" do
            icon "clipboard-list", "w-12 h-12 mx-auto mb-2 opacity-40"
            para r("dashboard.no_tasks").t
          end
        else
          div class: "space-y-3" do
            tasks.each do |task|
              render_task_item(task)
            end
          end
        end
      end
    end
  end

  private def render_task_item(task : Task)
    div class: "flex items-center justify-between p-4 bg-base-200 rounded-lg" do
      div class: "flex-1" do
        div class: "flex items-center gap-2 mb-1" do
          render_task_status_icon(task)
          span task.name, class: "font-semibold"
        end

        if guest = task.guest
          small r("tasks.assigned_to").t + ": #{guest.user!.name}", class: "text-sm text-base-content/60"
        end
      end

      div class: "flex gap-2" do
        render_task_actions(task)

        # Show delete button for organizers
        if is_organizer?
          form_for Tasks::Delete.with(task.id), class: "inline" do
            button type: "submit", class: "btn btn-sm btn-ghost btn-square", data_confirm: r("actions.confirm_delete").t do
              icon "trash", "w-4 h-4"
            end
          end
        end
      end
    end
  end

  private def render_task_status_icon(task : Task)
    case task.status
    when Task::Status::Pending
      icon "circle", "w-5 h-5 text-base-content/40"
    when Task::Status::InProgress
      icon "clock", "w-5 h-5 text-warning"
    when Task::Status::Completed
      icon "check-circle", "w-5 h-5 text-success"
    end
  end

  private def render_task_actions(task : Task)
    # Show actions only if this is user's task or if user is organizer
    if tg = task.guest
      if tg.user_id == current_user.id
      case task.status
      when Task::Status::Pending
        form_for Tasks::Start.with(task.id), class: "inline" do
          button r("tasks.start_task").t, class: "btn btn-sm btn-primary"
        end
      when Task::Status::InProgress
        link r("tasks.mark_complete").t, to: Tasks::Complete.with(task.id), class: "btn btn-sm btn-success"
      when Task::Status::Completed
        span r("tasks.statuses.completed").t, class: "badge badge-success"
      end
      end
    else
      render_task_status_badge(task)
    end
  end

  private def render_task_status_badge(task : Task)
    case task.status
    when Task::Status::Pending
      span r("tasks.statuses.pending").t, class: "badge badge-ghost"
    when Task::Status::InProgress
      span r("tasks.statuses.in_progress").t, class: "badge badge-warning"
    when Task::Status::Completed
      span r("tasks.statuses.completed").t, class: "badge badge-success"
    end
  end

  private def render_status_badge
    case event.status
    when Event::Status::Draft
      span r("events.statuses.draft").t, class: "badge badge-warning badge-lg"
    when Event::Status::Confirmed
      span r("events.statuses.confirmed").t, class: "badge badge-success badge-lg"
    when Event::Status::Cancelled
      span r("events.statuses.cancelled").t, class: "badge badge-error badge-lg"
    when Event::Status::Done
      span r("tasks.statuses.completed").t, class: "badge badge-ghost badge-lg"
    end
  end

  private def is_organizer?
    event.creator_id == current_user.id
  end

  private def format_datetime(time : Time)
    time.to_s("%A %d %B %Y, %H:%M")
  end
end
