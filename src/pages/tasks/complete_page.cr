class Tasks::CompletePage < MainLayout
  needs task : Task

  def page_title
    r("tasks.complete").t
  end

  def content
    div class: "max-w-2xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("tasks.complete").t, class: "card-title text-3xl mb-6"

          # Task details
          div class: "alert alert-info mb-6" do
            div do
              div class: "font-semibold text-lg", text: task.name
              if event = task.event
                para class: "text-sm opacity-70", text: r("guests.for_event").t(event: event.name)
              end
            end
          end

          form_for Tasks::Complete.with(task.id), class: "space-y-6" do
            # Cost input (optional)
            div class: "form-control" do
              label r("tasks.amount_spent").t, class: "label font-semibold"
              div class: "input-group" do
                span "€"
                input type: "number", name: "task:cost", step: "0.01", min: "0", placeholder: "0.00", class: "input input-bordered flex-1"
              end
              label class: "label" do
                span r("tasks.amount_spent_hint").t, class: "label-text-alt"
              end
            end

            # Notes
            div class: "form-control" do
              label r("guests.notes_optional").t, class: "label font-semibold"
              tag "textarea", name: "task:notes", class: "textarea textarea-bordered h-24", placeholder: r("tasks.notes_placeholder").t do
                text task.notes || ""
              end
            end

            div class: "card-actions justify-end mt-6" do
              link r("actions.cancel").t, to: Me::Show, class: "btn btn-ghost"
              button r("tasks.mark_complete").t, class: "btn btn-success btn-lg"
            end
          end
        end
      end
    end
  end
end
