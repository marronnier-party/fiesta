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
            if is_organizer?
              mount UI::InlineEdit,
                value: event.name,
                field_name: "event:name",
                update_url: Events::UpdateField.with(event.id).path,
                display_class: "text-4xl font-bold mb-2"
            else
              h1 event.name, class: "card-title text-4xl mb-2"
            end
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
          div do
            label r("events.description").t, class: "font-semibold block mb-1"
            if is_organizer?
              mount UI::InlineEdit,
                value: event.description || "",
                field_name: "event:description",
                update_url: Events::UpdateField.with(event.id).path,
                placeholder: r("events.add_description").t,
                multiline: true
            elsif description = event.description
              para description, class: "text-base-content/80"
            else
              para r("events.no_description").t, class: "text-base-content/50 italic"
            end
          end

          if start_at = event.start_at
            mount UI::InfoRow,
              icon_name: "calendar",
              label: r("events.start_at").t,
              text: format_datetime_formal(start_at),
              size: "lg"
          end

          if end_at = event.end_at
            mount UI::InfoRow,
              icon_name: "calendar",
              label: r("events.end_at").t,
              text: format_datetime_formal(end_at),
              size: "lg"
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
    div **attrs(
      id: "guest-stats",
      hx_get: Events::GuestStats.with(event.id).path,
      hx_trigger: "every 30s",
      hx_swap: "innerHTML"
    ) do
      render_guest_stats_content
    end
  end

  private def render_guest_stats_content
    confirmed = guests.count { |g| g.status == Guest::Status::Confirmed }
    pending = guests.count { |g| g.status == Guest::Status::NoAnswer }
    declined = guests.count { |g| g.status == Guest::Status::Declined }

    mount UI::StatsWidget, stats: [
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
  end

  private def render_guest_list
    div class: "card bg-base-100 shadow-xl", "x-data": "{ query: '' }" do
      div class: "card-body" do
        mount UI::SectionHeader, title: r("events.guest_list").t do
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

        # Search box with Alpine (debounced for performance)
        if guests.size > 3
          div class: "mb-4" do
            div class: "form-control" do
              div class: "input-group" do
                input type: "text",
                      "x-model.debounce.300ms": "query",
                      placeholder: r("search.guests").t,
                      class: "input input-bordered w-full",
                      "aria-label": r("search.guests").t
                div class: "btn btn-square" do
                  icon "search", "w-5 h-5"
                end
              end
            end
          end
        end

        # Guest list with Alpine filtering
        div class: "space-y-2" do
          guests.each do |guest|
            div "x-show": "!query || '#{guest.user!.name.downcase}'.includes(query.toLowerCase())" do
              render_guest_item(guest)
            end
          end
        end
      end
    end
  end

  private def render_guest_item(guest : Guest)
    mount Guests::GuestRow,
      guest: guest,
      current_user: current_user,
      is_organizer: is_organizer?,
      event: event
  end

  private def render_guest_status_badge(guest : Guest)
    mount UI::StatusBadge, status: guest.status
  end

  private def render_tasks_section
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        mount UI::SectionHeader, title: r("events.task_list").t do
          if is_organizer?
            div "x-data": "{ showQuickAdd: false }" do
              button "@click": "showQuickAdd = !showQuickAdd",
                     class: "btn btn-sm btn-primary" do
                icon "plus", "w-4 h-4"
                text " #{r("events.add_task").t}"
              end

              # Quick add form (shown when button clicked)
              div "x-show": "showQuickAdd",
                  "x-transition:enter": "transition ease-out duration-200",
                  "x-transition:enter-start": "opacity-0 -translate-y-2",
                  "x-transition:enter-end": "opacity-100 translate-y-0",
                  "x-transition:leave": "transition ease-in duration-150",
                  "x-transition:leave-start": "opacity-100 translate-y-0",
                  "x-transition:leave-end": "opacity-0 -translate-y-2",
                  class: "mt-4 p-4 bg-base-200 rounded-lg",
                  style: "display: none;" do
                render_quick_add_task_form
              end
            end
          end
        end

        if tasks.empty?
          mount UI::EmptyState,
            title: r("dashboard.no_tasks").t,
            icon_name: "clipboard-list",
            with_card: false
        else
          div id: "task-list", class: "space-y-3" do
            tasks.each do |task|
              mount Tasks::TaskCard,
                task: task,
                comments: task_comments[task.id]? || [] of Comment,
                current_user: current_user,
                is_organizer: is_organizer?,
                guests: guests,
                can_comment: can_comment_on_task?(task)

              # Add confirmation dialog for each task
              if is_organizer?
                mount UI::ConfirmDialog,
                  id: "confirm-delete-task-#{task.id}",
                  title: r("actions.confirm").t,
                  message: r("tasks.delete_confirm").t(name: task.name),
                  confirm_text: r("actions.delete").t,
                  cancel_text: r("actions.cancel").t,
                  confirm_class: "btn-error"
              end
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
    mount UI::Comment, comment: comment
  end

  private def render_task_status_icon(task : Task)
    mount UI::TaskStatusIcon, status: task.status
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
    mount UI::StatusBadge, status: task.status
  end

  private def render_status_badge
    mount UI::StatusBadge, status: event.status, size: "lg"
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
            mount UI::Alert, message: alert, type: "warning", size: "sm"
          end
        end
      end
    end
  end

  private def render_activity_item(activity : EventActivity)
    div class: "flex items-start gap-3 p-3 bg-base-200 rounded-lg" do
      mount UI::Avatar, user: activity.user!, size: "sm", initials_count: 1

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

  private def is_organizer?
    event.creator_id == current_user.id
  end

  private def can_comment_on_task?(task : Task)
    # Anyone who is a guest or organizer can comment
    is_organizer? || guests.any? { |g| g.user_id == current_user.id }
  end

  private def render_quick_add_task_form
    form **attrs(
      class: "space-y-3",
      hx_post: Events::QuickAddTask.with(event.id).path,
      hx_target: "#task-list",
      hx_swap: "afterbegin",
      x_data: "{ taskName: '', submitting: false }",
      "@htmx:before-request": "submitting = true",
      "@htmx:after-request": "submitting = false; taskName = ''; showQuickAdd = false"
    ) do
      div class: "form-control" do
        label r("tasks.name").t, class: "label label-text font-semibold"
        input type: "text",
              name: "task:name",
              "x-model": "taskName",
              placeholder: r("tasks.placeholder.name").t,
              class: "input input-bordered",
              required: true,
              "x-ref": "taskInput",
              "x-init": "$nextTick(() => $refs.taskInput.focus())"
      end

      div class: "flex gap-2 justify-end" do
        button type: "button",
               "@click": "showQuickAdd = false; taskName = ''",
               class: "btn btn-sm btn-ghost" do
          text r("actions.cancel").t
        end

        button type: "submit",
               class: "btn btn-sm btn-primary",
               "x-bind:disabled": "!taskName.trim() || submitting" do
          span "x-show": "!submitting" do
            icon "plus", "w-4 h-4"
            text " #{r("actions.add").t}"
          end
          span "x-show": "submitting", "x-cloak": true do
            mount UI::LoadingSpinner, size: "sm"
          end
        end
      end
    end
  end
end
