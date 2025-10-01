class Events::NewPage < MainLayout
  needs save_operation : SaveEvent

  def page_title
    r("events.create").t
  end

  def content
    div class: "max-w-3xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("events.new").t, class: "card-title text-3xl mb-6"

          form_for Events::Create, class: "space-y-6" do
            # Event name
            mount UI::FormInput,
              label_text: r("events.name").t,
              name: "event:name",
              value: save_operation.name.value.to_s,
              placeholder: r("events.placeholder.name").t,
              required: true

            # Description
            mount UI::FormTextarea,
              label_text: r("events.description").t,
              name: "event:description",
              value: save_operation.description.value,
              placeholder: r("events.placeholder.description").t,
              rows: 4

            # Date and time
            div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
              mount UI::FormInput,
                label_text: r("events.start_at").t,
                name: "event:start_at",
                value: format_datetime_input(save_operation.start_at.value),
                input_type: "datetime-local"

              mount UI::FormInput,
                label_text: r("events.end_at").t,
                name: "event:end_at",
                value: format_datetime_input(save_operation.end_at.value),
                input_type: "datetime-local"
            end

            # Location selection
            mount UI::FormSelect(Location),
              label_text: r("events.location").t,
              name: "event:location_id",
              options: LocationQuery.new.alphabetical.results,
              selected_value: save_operation.location_id.value.to_s,
              prompt: r("events.select_location").t,
              hint: r("events.or_create_location").t

            # Actions
            div class: "card-actions justify-end mt-8" do
              link r("actions.cancel").t, to: Events::Index, class: "btn btn-ghost"
              button r("events.save_as_draft").t, name: "event:status", value: Event::Status::Draft.value, class: "btn btn-outline"
              button r("events.publish_event").t, name: "event:status", value: Event::Status::Confirmed.value, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
