class EventTemplates::NewPage < MainLayout
  needs operation : SaveEventTemplate
  needs locations : Array(Location)

  def page_title
    r("event_templates.new").t
  end

  def content
    div class: "max-w-2xl mx-auto px-4 py-8" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("event_templates.new").t, class: "card-title text-3xl mb-6"

          form_for EventTemplates::Create, class: "space-y-6" do
            # Template name
            div class: "form-control" do
              label r("event_templates.name").t, class: "label font-semibold"
              input type: "text",
                name: "event_template:name",
                value: operation.name.value.to_s,
                placeholder: r("event_templates.name_placeholder").t,
                class: "input input-bordered w-full",
                required: true
            end

            # Description
            div class: "form-control" do
              label r("events.description").t + " (" + r("guests.notes_optional").t.downcase + ")", class: "label font-semibold"
              tag "textarea",
                name: "event_template:description",
                class: "textarea textarea-bordered h-24",
                placeholder: r("event_templates.description_placeholder").t do
                text operation.description.value || ""
              end
            end

            # Location
            div class: "form-control" do
              label r("events.location").t + " (" + r("guests.notes_optional").t.downcase + ")", class: "label font-semibold"
              tag "select", name: "event_template:location_id", class: "select select-bordered w-full" do
                tag "option", value: "" do
                  text r("events.no_location").t
                end
                locations.each do |location|
                  tag "option",
                    value: location.id,
                    selected: operation.location_id.value == location.id do
                    text location.name
                  end
                end
              end
            end

            div class: "alert alert-info" do
              icon "info-circle", "w-5 h-5"
              div do
                para r("event_templates.hint").t
              end
            end

            # Actions
            div class: "card-actions justify-end mt-8" do
              link r("actions.cancel").t, to: EventTemplates::Index, class: "btn btn-ghost"
              button r("actions.create").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
