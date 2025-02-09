class Tasks::ShowPage < MainLayout
  needs task : Task
  quick_def page_title, "Task with id: #{task.id}"

  def content
    link "Back to all Tasks", to: Tasks::Index
    h1 "Task with id: #{task.id}"
    render_actions
    render_task_fields
  end

  def render_actions
    section do
      link "Edit", to: Tasks::Edit.with(task.id)
      text " | "
      link "Delete",
        to: Tasks::Delete.with(task.id),
        data_confirm: "Are you sure?"
    end
  end

  def render_task_fields
    ul do
      li do
        text "name: "
        strong task.name.to_s
      end
    end
  end
end
