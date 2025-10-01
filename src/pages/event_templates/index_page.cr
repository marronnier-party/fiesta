class EventTemplates::IndexPage < MainLayout
  needs templates : Array(EventTemplate)

  def page_title
    r("event_templates.title").t
  end

  def content
    div class: "container mx-auto px-4 py-8" do
      mount UI::PageHeader,
        title: r("event_templates.title").t,
        title_size: "4xl",
        action_text: r("event_templates.new").t,
        action_path: EventTemplates::New

      if templates.empty?
        render_empty_state
      else
        div class: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" do
          templates.each do |template|
            render_template_card(template)
          end
        end
      end
    end
  end

  private def render_empty_state
    mount UI::EmptyState,
      title: r("event_templates.no_templates").t,
      description: r("event_templates.no_templates_hint").t,
      icon_name: "file-text",
      action_text: r("event_templates.new").t,
      action_path: EventTemplates::New
  end

  private def render_template_card(template : EventTemplate)
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 template.name, class: "card-title"

        if desc = template.description
          para desc, class: "text-base-content/70 text-sm mb-2 line-clamp-2"
        end

        if location = template.location
          mount UI::InfoRow,
            icon_name: "map-pin",
            text: location.name,
            size: "sm"
        end

        div class: "flex gap-2 text-sm text-base-content/60 mb-4" do
          mount UI::InfoRow,
            icon_name: "clipboard-list",
            text: "#{template.task_list.size} #{r("tasks.tasks").t}",
            size: "sm"
          mount UI::InfoRow,
            icon_name: "users",
            text: "#{template.guest_ids.size} #{r("guests.guests").t}",
            size: "sm"
        end

        div class: "card-actions justify-end" do
          link r("event_templates.use_template").t,
            to: Events::CreateFromTemplate.with(template.id),
            class: "btn btn-sm btn-primary"
          form_for EventTemplates::Delete.with(template.id), class: "inline" do
            button type: "submit",
              class: "btn btn-sm btn-ghost btn-square",
              data_confirm: r("actions.confirm_delete").t do
              icon "trash", "w-4 h-4"
            end
          end
        end
      end
    end
  end
end
