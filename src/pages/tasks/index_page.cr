class Tasks::IndexPage < MainLayout
  needs tasks : Array(Task)
  needs current_filter : String

  def page_title
    r("tasks.my_tasks").t
  end

  def content
    div class: "space-y-6" do
      # Header
      div class: "flex items-center justify-between" do
        h1 r("tasks.my_tasks").t, class: "text-3xl font-bold"
      end

      # Filter tabs
      render_filter_tabs

      # Tasks list
      if tasks.empty?
        render_empty_state
      else
        div class: "space-y-4" do
          tasks.each do |task|
            render_task_card(task)
          end
        end
      end
    end
  end

  private def render_filter_tabs
    div class: "tabs tabs-boxed w-full" do
      link_to_filter("all", r("tasks.filters.all").t)
      link_to_filter("pending", r("tasks.filters.pending").t)
      link_to_filter("in_progress", r("tasks.filters.in_progress").t)
      link_to_filter("completed", r("tasks.filters.completed").t)
    end
  end

  private def link_to_filter(status : String, label : String)
    link label,
      to: Tasks::Index.with(status: status),
      class: "tab #{current_filter == status ? "tab-active" : ""}"
  end

  private def render_task_card(task : Task)
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-start justify-between" do
          div class: "flex-1" do
            h2 task.name, class: "card-title"

            if event = task.event
              para class: "text-sm text-base-content/70 mt-1" do
                icon "calendar", "w-4 h-4 inline"
                text " "
                link event.name, to: Events::Show.with(event.id), class: "link"
              end
            end

            if task.category
              div class: "mt-2" do
                span class: "badge badge-outline" do
                  text task.category.not_nil!
                end
              end
            end
          end

          render_task_status_badge(task)
        end

        # Task actions
        div class: "card-actions justify-end mt-4" do
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
      end
    end
  end

  private def render_task_status_badge(task : Task)
    case task.status
    when Task::Status::Pending
      span r("tasks.statuses.pending").t, class: "badge badge-ghost badge-lg"
    when Task::Status::InProgress
      span r("tasks.statuses.in_progress").t, class: "badge badge-warning badge-lg"
    when Task::Status::Completed
      span r("tasks.statuses.completed").t, class: "badge badge-success badge-lg"
    end
  end

  private def render_empty_state
    div class: "text-center py-16" do
      icon "clipboard-list", "w-16 h-16 mx-auto mb-4 opacity-40"
      para r("dashboard.no_tasks").t, class: "text-xl text-base-content/60"
    end
  end
end
