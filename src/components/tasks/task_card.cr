class Tasks::TaskCard < BaseComponent
  needs task : Task
  needs comments : Array(Comment)
  needs current_user : User
  needs is_organizer : Bool
  needs guests : Array(Guest)
  needs can_comment : Bool

  def render
    div id: "task-#{task.id}",
        class: "card bg-base-200 transition-opacity duration-300",
        "x-data": optimistic_task_data do

      div class: "card-body p-4",
          ":class": "{ 'opacity-50': processing }" do
        # Task header - clickable to expand
        div class: "flex items-center justify-between cursor-pointer",
            "@click": "toggle()" do

          div class: "flex items-center gap-3 flex-1" do
            # Status icon
            mount UI::TaskStatusIcon, status: task.status

            div class: "flex-1" do
              span task.name, class: "font-semibold"

              if guest = task.guest
                small " • #{guest.user!.name}", class: "text-sm text-base-content/60"
              end
            end

            # Comment count badge (hidden when expanded)
            if comments.any?
              span comments.size.to_s,
                   class: "badge badge-sm",
                   "x-show": "!expanded"
            end

            # Expand indicator
            mount UI::Icon,
                 name: "chevron-down",
                 classes: "w-4 h-4 transition-transform",
                 ":class": "{ 'rotate-180': expanded }"
          end
        end

        # Task actions (outside collapsible - always visible)
        div class: "flex gap-2 mt-3", "@click.stop": "" do
          render_task_actions
        end

        # Expandable comments section
        div "x-show": "expanded",
            "x-transition:enter": "transition ease-out duration-200",
            "x-transition:enter-start": "opacity-0 max-h-0",
            "x-transition:enter-end": "opacity-100 max-h-screen",
            "x-transition:leave": "transition ease-in duration-150",
            "x-transition:leave-start": "opacity-100 max-h-screen",
            "x-transition:leave-end": "opacity-0 max-h-0",
            class: "mt-4 pt-4 border-t border-base-300",
            style: "display: none;" do

          # Comments list
          div id: "task-#{task.id}-comments", class: "space-y-2 mb-4" do
            comments.each do |comment|
              mount UI::Comment, comment: comment
            end
          end

          # Add comment form with htmx
          if @can_comment
            render_comment_form
          end
        end
      end
    end
  end

  private def render_task_actions
    # Show actions only if this is user's task or if user is organizer
    if tg = task.guest
      if tg.user_id == current_user.id
        case task.status
        when Task::Status::Pending
          button r("tasks.start_task").t,
            class: "btn btn-sm btn-primary",
            hx_post: Tasks::Start.with(task.id).path,
            hx_target: "#task-#{task.id}",
            hx_swap: "outerHTML",
            "@htmx:before-request": "processing = true"
        when Task::Status::InProgress
          button r("tasks.complete_task").t,
            class: "btn btn-sm btn-success",
            hx_post: Tasks::Complete.with(task.id).path,
            hx_target: "#task-#{task.id}",
            hx_swap: "outerHTML",
            "@htmx:before-request": "processing = true"
        else
          render_task_status_badge
        end
      else
        render_task_status_badge
      end
    else
      render_task_status_badge
    end

    # Organizer actions
    if @is_organizer
      render_organizer_actions
    end
  end

  private def render_task_status_badge
    mount UI::StatusBadge, status: task.status
  end

  private def render_organizer_actions
    # Reassign dropdown with dependent selects
    div class: "dropdown dropdown-end", "x-data": "{ open: false }" do
      label class: "btn btn-sm btn-ghost", "@click": "open = !open" do
        icon "user-plus", "w-4 h-4"
      end
      div class: "dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 z-10",
           "x-show": "open",
           "@click.away": "open = false",
           style: "display: none;" do
        form_for Tasks::Reassign.with(task.id), class: "p-2 space-y-2" do
          label r("tasks.reassign_task").t, class: "label label-text font-semibold"

          # Filter dropdown
          div class: "form-control" do
            label r("tasks.filter_by_status").t, class: "label label-text-alt"
            tag "select",
              name: "status",
              class: "select select-bordered select-sm w-full",
              hx_get: Tasks::FilterAssignees.with(task.event_id).path,
              hx_trigger: "change",
              hx_target: "#assignee-select-#{task.id}",
              hx_swap: "innerHTML",
              hx_include: "[name='status']" do
              tag "option", value: "all", text: r("tasks.all_guests").t
              tag "option", value: "confirmed", text: r("tasks.confirmed_guests").t
              tag "option", value: "pending", text: r("tasks.pending_guests").t
            end
          end

          # Assignee dropdown (dependent)
          div class: "form-control" do
            label r("tasks.assignee").t, class: "label label-text-alt"
            tag "select",
                id: "assignee-select-#{task.id}",
                name: "guest_id",
                class: "select select-bordered select-sm w-full",
                required: true do
              tag "option", value: "", disabled: true, selected: task.guest_id.nil? do
                text r("tasks.select_assignee").t
              end
              guests.select(&.status.confirmed?).each do |guest|
                tag "option", value: guest.id.to_s, selected: task.guest_id == guest.id do
                  text guest.user!.name
                end
              end
            end
          end

          button r("tasks.reassign").t, class: "btn btn-primary btn-sm btn-block"
        end
      end
    end

    # Delete button with optimistic UI and confirmation
    button "@click": delete_action,
           class: "btn btn-sm btn-ghost btn-square" do
      icon "trash", "w-4 h-4"
    end
  end

  private def render_comment_form
    form class: "space-y-2",
      hx_post: ::Comments::Create.path,
      hx_target: "#task-#{task.id}-comments",
      hx_swap: "beforeend",
      x_data: "{ content: '' }" do

      input type: "hidden", name: "comment:commentable_type", value: "Task"
      input type: "hidden", name: "comment:commentable_id", value: task.id.to_s

      div class: "form-control" do
        tag "textarea",
            name: "comment:content",
            "x-model": "content",
            placeholder: r("comments.add_comment").t,
            class: "textarea textarea-bordered textarea-sm",
            rows: "2",
            required: true
      end

      div class: "flex justify-end" do
        button r("comments.post").t,
               class: "btn btn-sm btn-primary",
               type: "submit",
               "@htmx:after-request": "content = ''"
      end
    end
  end

  private def optimistic_task_data
    "Object.assign(collapsible(false), {
      processing: false
    })"
  end

  private def delete_action
    "$dispatch('open-modal-confirm-delete-task-#{task.id}', {
      action: '#{Tasks::Delete.with(task.id).path}',
      target: '#task-#{task.id}',
      swap: 'outerHTML'
    })"
  end
end
