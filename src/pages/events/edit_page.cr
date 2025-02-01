class Events::EditPage < MainLayout
  needs operation : SaveEvent
  needs event : Event
  quick_def page_title, "Edit Event with id: #{event.id}"

  def content
    link "Back to all Events", to: Events::Index
    h1 "Edit Event with id: #{event.id}"
    render_event_form(operation)
  end

  def render_event_form(op)
    form_for Events::Update.with(event.id) do
      # Edit fields in src/components/events/form_fields.cr
      mount Events::FormFields, op

      submit "Update", data_disable_with: "Updating..."
    end
  end
end
