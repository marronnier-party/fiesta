class Events::ShowPage < MainLayout
  needs event : Event
  quick_def page_title, "Event with id: #{event.id}"

  def content
    link "Back to all Events", to: Events::Index
    h1 "Event with id: #{event.id}"
    render_actions
    render_event_fields
  end

  def render_actions
    section do
      link "Edit", to: Events::Edit.with(event.id)
      text " | "
      link "Delete",
        to: Events::Delete.with(event.id),
        data_confirm: "Are you sure?"
    end
  end

  def render_event_fields
    ul do
      li do
        text "name: "
        strong event.name.to_s
      end
      li do
        text "description: "
        strong event.description.to_s
      end
    end
  end
end
