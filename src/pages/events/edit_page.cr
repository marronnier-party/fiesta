class Events::EditPage < MainLayout
  needs operation : SaveEvent
  needs event : Event

  def page_title
    r("events.edit").t
  end

  def content
    div class: "max-w-3xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("events.edit").t, class: "card-title text-3xl mb-6"

          form_for Events::Update.with(event.id), class: "space-y-6" do
            # Event name
            mount UI::FormInput,
              label_text: r("events.name").t,
              name: "event:name",
              value: operation.name.value.to_s,
              placeholder: r("events.placeholder.name").t,
              required: true

            # Description
            mount UI::FormTextarea,
              label_text: r("events.description").t,
              name: "event:description",
              value: operation.description.value,
              placeholder: r("events.placeholder.description").t,
              rows: 4

            # Organizer Notes (private)
            mount UI::FormTextarea,
              label_text: r("events.organizer_notes").t,
              name: "event:organizer_notes",
              value: operation.organizer_notes.value,
              placeholder: r("events.organizer_notes_placeholder").t,
              rows: 3,
              hint: r("events.organizer_notes_hint").t

            # Date and time
            div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
              mount UI::FormInput,
                label_text: r("events.start_at").t,
                name: "event:start_at",
                value: format_datetime_input(operation.start_at.value),
                input_type: "datetime-local"

              mount UI::FormInput,
                label_text: r("events.end_at").t,
                name: "event:end_at",
                value: format_datetime_input(operation.end_at.value),
                input_type: "datetime-local"
            end

            # Location selection
            mount UI::FormSelect(Location),
              label_text: r("events.location").t,
              name: "event:location_id",
              options: LocationQuery.new.alphabetical.results,
              selected_value: operation.location_id.value.to_s,
              prompt: r("events.select_location").t,
              hint: r("events.or_create_location").t

            # Budget
            mount UI::FormInput,
              label_text: r("events.budget.label").t,
              name: "event:budget",
              value: operation.budget.value.to_s,
              input_type: "number",
              placeholder: "0.00",
              hint: r("events.budget.hint").t

            # Actions
            div class: "card-actions justify-end mt-8" do
              link r("actions.cancel").t, to: Events::Show.with(event.id), class: "btn btn-ghost"
              button r("actions.update").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
