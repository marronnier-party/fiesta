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
            div class: "form-control" do
              label r("tasks.name").t, class: "label font-semibold"
              input type: "text", name: "task:name", value: save_operation.name.value.to_s, placeholder: r("tasks.placeholder.name").t, class: "input input-bordered w-full", required: true
            end

            # Assign to guest
            div class: "form-control" do
              label r("tasks.assign_to").t, class: "label font-semibold"
              tag "select", name: "task:guest_id", class: "select select-bordered w-full", required: true do
                tag "option", value: "" do
                  text r("tasks.select_assignee").t
                end

                guests.each do |guest|
                  tag "option", value: guest.id.to_s, selected: (save_operation.guest_id.value == guest.id) do
                    text guest.user!.name
                  end
                end
              end
            end

            # Task category (optional)
            div class: "form-control" do
              label r("tasks.category").t + " (" + r("guests.notes_optional").t.downcase + ")", class: "label font-semibold"
              tag "select", name: "task:category", class: "select select-bordered w-full" do
                tag "option", value: "" do
                  text r("tasks.select_category").t
                end

                ["food", "beverages", "setup", "cleanup", "entertainment", "decorations", "other"].each do |category|
                  tag "option", value: category do
                    text translate_category(category)
                  end
                end
              end
            end

            # Notes
            div class: "form-control" do
              label r("guests.notes_optional").t, class: "label font-semibold"
              tag "textarea", name: "task:notes", class: "textarea textarea-bordered h-24", placeholder: r("tasks.notes_placeholder").t do
                text save_operation.notes.value || ""
              end
            end

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
