class Tasks::CompletePage < MainLayout
  needs task : Task

  def page_title
    "Complete Task"
  end

  def content
    div class: "max-w-2xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 "Complete Task", class: "card-title text-3xl mb-6"

          # Task details
          div class: "alert alert-info mb-6" do
            div do
              div class: "font-semibold text-lg", text: task.name
              if event = task.event
                para class: "text-sm opacity-70", text: "For: #{event.name}"
              end
            end
          end

          form_for Tasks::Complete.with(task.id), class: "space-y-6" do
            # Cost input (optional)
            div class: "form-control" do
              label "Amount spent (optional)", class: "label font-semibold"
              div class: "input-group" do
                span "€"
                input type: "number", name: "task:cost", step: "0.01", min: "0", placeholder: "0.00", class: "input input-bordered flex-1"
              end
              label class: "label" do
                span "Enter how much you spent on this task", class: "label-text-alt"
              end
            end

            # Notes
            div class: "form-control" do
              label "Notes (optional)", class: "label font-semibold"
              tag "textarea", name: "task:notes", class: "textarea textarea-bordered h-24", placeholder: "Any comments or details..." do
                text task.notes || ""
              end
            end

            div class: "card-actions justify-end mt-6" do
              link "Cancel", to: Me::Show, class: "btn btn-ghost"
              button "Mark as Complete", class: "btn btn-success btn-lg"
            end
          end
        end
      end
    end
  end
end
