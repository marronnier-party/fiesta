class Tasks::IndexPage < MainLayout
  needs tasks : Array(Task)
  needs current_filter : String

  def page_title
    r("tasks.my_tasks").t
  end

  def content
    div class: "space-y-6" do
      # Header
      mount UI::PageHeader, title: r("tasks.my_tasks").t

      # Filter tabs
      mount UI::FilterTabs,
        tabs: filter_tabs,
        current_value: current_filter

      # Tasks list
      if tasks.empty?
        mount UI::EmptyState,
          title: r("dashboard.no_tasks").t,
          icon_name: "clipboard-list",
          with_card: false
      else
        div class: "space-y-4" do
          tasks.each do |task|
            render_task_card(task)
          end
        end
      end
    end
  end

  private def filter_tabs
    [
      UI::FilterTabs::Tab.new(
        label: r("tasks.filters.all").t,
        value: "all",
        path: Tasks::Index.with(status: "all").path
      ),
      UI::FilterTabs::Tab.new(
        label: r("tasks.filters.pending").t,
        value: "pending",
        path: Tasks::Index.with(status: "pending").path
      ),
      UI::FilterTabs::Tab.new(
        label: r("tasks.filters.in_progress").t,
        value: "in_progress",
        path: Tasks::Index.with(status: "in_progress").path
      ),
      UI::FilterTabs::Tab.new(
        label: r("tasks.filters.completed").t,
        value: "completed",
        path: Tasks::Index.with(status: "completed").path
      ),
    ]
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

          mount UI::StatusBadge, status: task.status, size: "lg"
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
end
