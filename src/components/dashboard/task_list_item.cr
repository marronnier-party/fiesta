class Dashboard::TaskListItem < BaseComponent
  needs task : Task

  def render
    div class: "card bg-base-100 border border-base-300" do
      div class: "card-body p-4" do
        div class: "flex items-start justify-between gap-4" do
          div class: "flex-1" do
            div class: "flex items-center gap-2 mb-2" do
              h4 task.name, class: "font-semibold text-base"
              mount UI::StatusBadge, status: task.status, size: "sm"
            end

            div class: "flex flex-col gap-1 text-sm text-base-content/70" do
              if event = task.event
                mount UI::InfoRow,
                  icon_name: "calendar",
                  text: event.name,
                  size: "sm"
              end

              if category = task.category
                mount UI::InfoRow,
                  icon_name: "tag",
                  text: category,
                  size: "sm"
              end

              if notes = task.notes
                para class: "text-base-content/60 mt-1", text: notes
              end
            end
          end

          render_actions
        end
      end
    end
  end

  private def render_actions
    div class: "flex flex-col gap-2" do
      case task.status
      when Task::Status::Pending
        link "Start Task", to: Tasks::Complete.with(task.id), class: "btn btn-sm btn-primary"
      when Task::Status::InProgress
        link "Mark Complete", to: Tasks::Complete.with(task.id), class: "btn btn-sm btn-success"
      when Task::Status::Completed
        if completed_at = task.completed_at
          para class: "text-xs text-base-content/60" do
            text "Completed"
            br
            text format_date_short(completed_at)
          end
        end
      end
    end
  end
end
