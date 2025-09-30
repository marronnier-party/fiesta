class EventTemplates::IndexPage < MainLayout
  needs templates : Array(EventTemplate)

  def page_title
    r("event_templates.title").t
  end

  def content
    div class: "container mx-auto px-4 py-8" do
      div class: "flex justify-between items-center mb-8" do
        h1 r("event_templates.title").t, class: "text-4xl font-bold"
        link r("event_templates.new").t, to: EventTemplates::New, class: "btn btn-primary"
      end

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
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body text-center py-12" do
        icon "file-text", "w-16 h-16 mx-auto mb-4 text-base-content/40"
        h2 r("event_templates.no_templates").t, class: "text-2xl font-bold mb-2"
        para r("event_templates.no_templates_hint").t, class: "text-base-content/70 mb-6"
        link r("event_templates.new").t, to: EventTemplates::New, class: "btn btn-primary"
      end
    end
  end

  private def render_template_card(template : EventTemplate)
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 template.name, class: "card-title"

        if desc = template.description
          para desc, class: "text-base-content/70 text-sm mb-2 line-clamp-2"
        end

        if location = template.location
          div class: "flex items-center gap-2 text-sm text-base-content/60 mb-2" do
            icon "map-pin", "w-4 h-4"
            span location.name
          end
        end

        div class: "flex gap-2 text-sm text-base-content/60 mb-4" do
          div class: "flex items-center gap-1" do
            icon "clipboard-list", "w-4 h-4"
            span "#{template.task_list.size} #{r("tasks.tasks").t}"
          end
          div class: "flex items-center gap-1" do
            icon "users", "w-4 h-4"
            span "#{template.guest_ids.size} #{r("guests.guests").t}"
          end
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
