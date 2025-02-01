class Events::NewPage < MainLayout
  needs operation : SaveEvent
  quick_def page_title, "New Event"

  def content
    h1 "New Event"
    render_event_form(operation)
  end

  def render_event_form(op)
    form_for Events::Create do
      # Edit fields in src/components/events/form_fields.cr
      mount Events::FormFields, op

      submit "Save", data_disable_with: "Saving..."
    end
  end
end
