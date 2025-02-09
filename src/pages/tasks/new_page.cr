class Tasks::NewPage < MainLayout
  needs operation : SaveTask
  quick_def page_title, "New Task"

  def content
    h1 "New Task"
    render_task_form(operation)
  end

  def render_task_form(op)
    form_for Tasks::Create do
      # Edit fields in src/components/tasks/form_fields.cr
      mount Tasks::FormFields, op

      submit "Save", data_disable_with: "Saving..."
    end
  end
end
