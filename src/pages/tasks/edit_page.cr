class Tasks::EditPage < MainLayout
  needs operation : SaveTask
  needs task : Task
  quick_def page_title, "Edit Task with id: #{task.id}"

  def content
    link "Back to all Tasks", to: Tasks::Index
    h1 "Edit Task with id: #{task.id}"
    render_task_form(operation)
  end

  def render_task_form(op)
    form_for Tasks::Update.with(task.id) do
      # Edit fields in src/components/tasks/form_fields.cr
      mount Tasks::FormFields, op

      submit "Update", data_disable_with: "Updating..."
    end
  end
end
