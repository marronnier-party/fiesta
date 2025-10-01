class Events::AddTaskPage < MainLayout
  needs event : Event
  needs guests : Array(Guest)
  needs save_operation : SaveTask

  def page_title
    r("events.add_task").t
  end

  def content
    div class: "max-w-2xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("events.add_task").t, class: "card-title text-3xl mb-2"
          para r("guests.for_event").t(event: event.name), class: "text-base-content/70 mb-6"

          form_for Events::AddTask.with(event.id), class: "space-y-6" do
            # Task name
            mount UI::FormInput,
              label_text: r("tasks.name").t,
              name: "task:name",
              value: save_operation.name.value.to_s,
              placeholder: r("tasks.placeholder.name").t,
              required: true

            # Assign to guest
            mount UI::FormSelect(Guest),
              label_text: r("tasks.assign_to").t,
              name: "task:guest_id",
              options: guests,
              selected_value: save_operation.guest_id.value,
              prompt: r("tasks.select_assignee").t,
              option_value: ->(g : Guest) { g.id.to_s },
              option_label: ->(g : Guest) { g.user!.name },
              required: true

            # Task category (optional)
            mount UI::FormSelect(String),
              label_text: r("tasks.category").t + " (" + r("guests.notes_optional").t.downcase + ")",
              name: "task:category",
              options: ["food", "beverages", "setup", "cleanup", "entertainment", "decorations", "other"].map { |cat|
                {cat, translate_category(cat)}
              },
              selected_value: save_operation.category.value,
              prompt: r("tasks.select_category").t

            # Notes
            mount UI::FormTextarea,
              label_text: r("guests.notes_optional").t,
              name: "task:notes",
              value: save_operation.notes.value,
              placeholder: r("tasks.notes_placeholder").t,
              rows: 3

            div class: "card-actions justify-end mt-6" do
              link r("actions.cancel").t, to: Events::Show.with(event.id), class: "btn btn-ghost"
              button r("actions.create").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end

  private def translate_category(category : String) : String
    case category
    when "food"
      r("tasks.categories.food").t
    when "beverages"
      r("tasks.categories.beverages").t
    when "setup"
      r("tasks.categories.setup").t
    when "cleanup"
      r("tasks.categories.cleanup").t
    when "entertainment"
      r("tasks.categories.entertainment").t
    when "decorations"
      r("tasks.categories.decorations").t
    when "other"
      r("tasks.categories.other").t
    else
      category
    end
  end
end
