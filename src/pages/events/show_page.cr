class Events::ShowPage < MainLayout
  needs event : Event
  needs guests : Array(Guest)
  needs tasks : Array(Task)
  needs task_comments : Hash(Int64, Array(Comment))
  needs user_guest : Guest?
  needs activities : Array(EventActivity)
  needs weather_forecast : WeatherService::WeatherForecast?

  def page_title
    event.name
  end

  def content
    div class: "space-y-6" do
      render_event_header

      div class: "grid grid-cols-1 lg:grid-cols-3 gap-6" do
        div class: "lg:col-span-2 space-y-6" do
          render_event_details
          render_weather_widget if weather_forecast
          render_budget_section if is_organizer? && event.budget
          render_expense_split_link if is_organizer? && event.actual_cost > 0
          render_organizer_notes if is_organizer?
          render_tasks_section
        end

        div class: "space-y-6" do
          render_guest_stats
          render_guest_list
          render_activity_feed
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
          div class: "card-actions justify-end mt-4 gap-2 flex-wrap" do
            link r("events.invite_guests").t, to: Events::InviteGuests.with(event.id), class: "btn btn-primary"
            link r("events.add_task").t, to: Events::AddTask.with(event.id), class: "btn btn-secondary"
            link r("actions.edit").t, to: Events::Edit.with(event.id), class: "btn btn-ghost"

            # Secret Santa button
            link "🎅 " + r("secret_santa.title").t, to: SecretSanta::Show.with(event.id), class: "btn btn-ghost"

            # Messages button
            link "💬 " + r("messaging.title").t, to: Events::ShowMessages.with(event.id), class: "btn btn-ghost"

            # Check-in mode button (only on event day)
            if start_at = event.start_at
              if (start_at - Time.utc).abs <= 24.hours
                link "✓ " + r("checkin.mode").t, to: Events::CheckInMode.with(event.id), class: "btn btn-success"
              end
            end

            # Export guests button
            link r("events.export_guests").t, to: Events::ExportGuests.with(event.id), class: "btn btn-ghost btn-sm"

            # Duplicate event button
            form_for Events::Duplicate.with(event.id), class: "inline" do
              button r("events.duplicate_event").t, type: "submit", class: "btn btn-ghost"
            end

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
                span class: "text-base-content/80" do
                  text format_datetime(start_at)
                end
              end
            end
          end

          if end_at = event.end_at
            div class: "flex items-center gap-3" do
              icon "calendar", "w-6 h-6 text-primary"
              div do
                label r("events.end_at").t, class: "font-semibold block"
                span class: "text-base-content/80" do
                  text format_datetime(end_at)
                end
              end
            end
          end

          if location = event.location
            div class: "flex items-start gap-3" do
              icon "map-pin", "w-6 h-6 text-primary"
              div do
                label r("events.location").t, class: "font-semibold block"
                span class: "text-base-content/80" do
                  text location.name
                end
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
            elsif ug.status == Guest::Status::Confirmed && event.start_at
              # Show calendar export for confirmed guests
              div class: "mt-6" do
                link "📅 " + r("calendar.export").t, to: Events::ExportCalendar.with(event.id), class: "btn btn-outline btn-block"
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
        div class: "flex items-center justify-between mb-4" do
          h2 r("events.guest_list").t, class: "card-title text-2xl"

          # Send reminders button for organizers
          if is_organizer?
            pending_count = guests.count { |g| g.status == Guest::Status::NoAnswer }
            if pending_count > 0
              form_for Events::SendReminders.with(event.id), class: "inline" do
                button r("events.reminders.send_reminders").t, class: "btn btn-sm btn-outline btn-primary"
              end
            end
          end
        end

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

      div class: "flex items-center gap-2" do
        render_guest_status_badge(guest)

        # Show attendance marking for organizers on past events
        if is_organizer? && event.start_at && event.start_at.not_nil! < Time.utc
          if guest.status == Guest::Status::Confirmed
            form_for Guests::MarkAttended.with(guest.id), class: "inline" do
              button r("guests.mark_attended").t, type: "submit", class: "btn btn-xs btn-success"
            end
          elsif guest.status == Guest::Status::Attended
            form_for Guests::UnmarkAttended.with(guest.id), class: "inline" do
              button r("guests.unmark_attended").t, type: "submit", class: "btn btn-xs btn-ghost"
            end
          end
        end
      end
    end
  end

  private def render_guest_status_badge(guest : Guest)
    case guest.status
    when Guest::Status::Confirmed
      span r("guests.statuses.confirmed").t, class: "badge badge-success"
    when Guest::Status::Attended
      span r("guests.statuses.attended").t, class: "badge badge-primary"
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
    div class: "collapse collapse-arrow bg-base-200" do
      input type: "checkbox", class: "peer"

      div class: "collapse-title flex items-center justify-between pr-12" do
        div class: "flex-1" do
          div class: "flex items-center gap-2 mb-1" do
            render_task_status_icon(task)
            span class: "font-semibold" do
              text task.name
            end
          end

          if guest = task.guest
            small r("tasks.assigned_to").t + ": #{guest.user!.name}", class: "text-sm text-base-content/60"
          end

          # Show comment count
          comments = task_comments[task.id]? || [] of Comment
          if comments.size > 0
            span class: "text-xs text-base-content/50" do
              text " • #{comments.size} #{r("comments.comment_count").t}"
            end
          end
        end

        div class: "flex gap-2" do
          render_task_actions(task)

        # Show reassign button for organizers
        if is_organizer?
          div class: "dropdown dropdown-end" do
            label class: "btn btn-sm btn-ghost", tabindex: "0" do
              icon "user-plus", "w-4 h-4"
            end
            div class: "dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10", tabindex: "0" do
              form_for Tasks::Reassign.with(task.id), class: "p-2" do
                label r("tasks.reassign_task").t, class: "label label-text font-semibold"
                tag "select", name: "guest_id", class: "select select-bordered select-sm w-full mb-2", required: true do
                  tag "option", value: "", disabled: true, selected: task.guest_id.nil? do
                    text r("tasks.select_assignee").t
                  end
                  guests.select(&.status.confirmed?).each do |guest|
                    tag "option", value: guest.id.to_s, selected: task.guest_id == guest.id do
                      text guest.user!.name
                    end
                  end
                end
                button r("tasks.reassign").t, class: "btn btn-primary btn-sm btn-block"
              end
            end
          end

          # Show delete button for organizers
          form_for Tasks::Delete.with(task.id), class: "inline" do
            button type: "submit", class: "btn btn-sm btn-ghost btn-square", data_confirm: r("actions.confirm_delete").t do
              icon "trash", "w-4 h-4"
            end
          end
        end
        end
      end

      # Collapse content - comments section
      div class: "collapse-content" do
        render_task_comments(task)
      end
    end
  end

  private def render_task_comments(task : Task)
    comments = task_comments[task.id]? || [] of Comment

    div class: "space-y-4 pt-4" do
      # Comments list
      if comments.any?
        div class: "space-y-2" do
          comments.each do |comment|
            render_comment(comment)
          end
        end
      end

      # Add comment form
      can_comment = is_organizer? || (task.guest_id && task.guest_id == user_guest.try(&.id))
      if can_comment
        form_for Comments::Create, class: "mt-4" do
          input type: "hidden", name: "comment:commentable_type", value: "Task"
          input type: "hidden", name: "comment:commentable_id", value: task.id.to_s

          div class: "form-control" do
            tag "textarea",
              name: "comment:content",
              class: "textarea textarea-bordered",
              placeholder: r("comments.add_comment").t,
              rows: "2",
              required: true
          end

          div class: "flex justify-end mt-2" do
            button r("comments.post").t, class: "btn btn-sm btn-primary"
          end
        end
      end
    end
  end

  private def render_comment(comment : Comment)
    div class: "flex gap-3 p-3 bg-base-100 rounded-lg" do
      div class: "avatar placeholder" do
        div class: "bg-neutral text-neutral-content rounded-full w-8" do
          span class: "text-xs" do
            text comment.user!.name[0..0].upcase
          end
        end
      end

      div class: "flex-1" do
        div class: "flex items-baseline gap-2" do
          span class: "font-semibold text-sm" do
            text comment.user!.name
          end
          small class: "text-xs text-base-content/60" do
            text format_relative_time(comment.created_at)
          end
        end
        para comment.content, class: "text-sm mt-1"
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

  private def render_budget_section
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center justify-between mb-4" do
          h2 r("events.budget.title").t, class: "card-title"
          link r("actions.edit").t, to: Events::Edit.with(event.id), class: "btn btn-ghost btn-sm"
        end

        if budget = event.budget
          actual = event.actual_cost
          remaining = event.remaining_budget
          percentage = event.budget_percentage_used

          div class: "space-y-4" do
            # Budget overview
            div class: "stats shadow w-full" do
              div class: "stat" do
                div class: "stat-title" do
                  text r("events.budget.total_budget").t
                end
                div "$#{"%.2f" % budget}", class: "stat-value text-primary"
              end

              div class: "stat" do
                div class: "stat-title" do
                  text r("events.budget.actual_cost").t
                end
                div "$#{"%.2f" % actual}", class: "stat-value #{actual > budget ? "text-error" : "text-info"}"
              end

              div class: "stat" do
                div class: "stat-title" do
                  text r("events.budget.remaining").t
                end
                if rem = remaining
                  div "$#{"%.2f" % rem}", class: "stat-value #{rem < 0 ? "text-error" : "text-success"}"
                end
              end
            end

            # Progress bar
            if pct = percentage
              div class: "space-y-2" do
                div class: "flex justify-between text-sm" do
                  span do
                    text r("events.budget.used").t
                  end
                  span do
                    text "#{"%.1f" % pct}%"
                  end
                end
                tag "progress", class: "progress #{pct > 100 ? "progress-error" : pct > 80 ? "progress-warning" : "progress-success"} w-full", value: pct.to_s, max: "100"
              end
            end
          end
        end
      end
    end
  end

  private def render_expense_split_link
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center justify-between" do
          div do
            h2 r("expense_split.title").t, class: "card-title"
            para "Calculez la répartition des dépenses entre les invités", class: "text-sm text-base-content/60"
          end
          link r("expense_split.title").t, to: Events::ExpenseSplit.with(event.id), class: "btn btn-primary"
        end
      end
    end
  end

  private def render_organizer_notes
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center justify-between mb-4" do
          h2 r("events.organizer_notes").t, class: "card-title"
          link r("actions.edit").t, to: Events::Edit.with(event.id), class: "btn btn-ghost btn-sm"
        end

        if notes = event.organizer_notes
          if notes.empty?
            para r("events.organizer_notes_hint").t, class: "text-base-content/60 italic"
          else
            para notes, class: "text-base-content/80 whitespace-pre-wrap"
          end
        else
          para r("events.organizer_notes_hint").t, class: "text-base-content/60 italic"
        end
      end
    end
  end

  private def render_activity_feed
    return if activities.empty?

    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 r("events.activity_feed").t, class: "card-title mb-4"

        div class: "space-y-3" do
          activities.each do |activity|
            render_activity_item(activity)
          end
        end
      end
    end
  end

  private def render_weather_widget
    return unless forecast = weather_forecast

    div class: "card bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center justify-between mb-2" do
          h2 r("weather.title").t, class: "card-title text-xl"
          span forecast.temperature.to_i.to_s + "°C", class: "text-3xl font-bold"
        end

        div class: "space-y-2" do
          div class: "flex items-center gap-2" do
            case forecast.condition
            when "Sunny"
              span "☀️", class: "text-2xl"
            when "Cloudy"
              span "☁️", class: "text-2xl"
            when "Partly Cloudy"
              span "⛅", class: "text-2xl"
            when "Rainy"
              span "🌧️", class: "text-2xl"
            end
            span forecast.condition, class: "text-lg font-medium"
          end

          para r("weather.description").t, class: "text-sm text-base-content/80"

          div class: "flex gap-4 text-sm mt-3" do
            div do
              span "💧 ", class: "opacity-70"
              text r("weather.humidity").t + ": #{forecast.humidity}%"
            end
            div do
              span "💨 ", class: "opacity-70"
              text r("weather.wind_speed").t + ": #{forecast.wind_speed.to_i} km/h"
            end
          end

          # Weather alert if any
          if alert = WeatherService.get_weather_alert(forecast)
            div class: "alert alert-warning mt-3 py-2" do
              span alert, class: "text-sm"
            end
          end
        end
      end
    end
  end

  private def render_activity_item(activity : EventActivity)
    div class: "flex items-start gap-3 p-3 bg-base-200 rounded-lg" do
      div class: "avatar placeholder" do
        div class: "bg-neutral text-neutral-content rounded-full w-8" do
          span class: "text-xs" do
            text activity.user!.name[0..0].upcase
          end
        end
      end

      div class: "flex-1" do
        para class: "text-sm" do
          span activity.user!.name, class: "font-semibold"
          text " "
          text activity.description
        end
        small format_relative_time(activity.created_at), class: "text-xs text-base-content/60"
      end
    end
  end

  private def format_relative_time(time : Time)
    diff = Time.utc - time
    minutes = diff.total_minutes.to_i

    if minutes < 1
      r("time.just_now").t
    elsif minutes < 60
      r("time.minutes_ago").t(count: minutes)
    elsif minutes < 1440 # 24 hours
      hours = (minutes / 60).to_i
      r("time.hours_ago").t(count: hours)
    else
      days = (minutes / 1440).to_i
      r("time.days_ago").t(count: days)
    end
  end

  private def is_organizer?
    event.creator_id == current_user.id
  end

  private def format_datetime(time : Time)
    time.to_s("%A %d %B %Y, %H:%M")
  end
end
