class TaskCategories::NewPage < MainLayout
  needs operation : SaveTaskCategory

  def page_title
    r("task_categories.new").t
  end

  def content
    div class: "max-w-2xl mx-auto px-4 py-8" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("task_categories.new").t, class: "card-title text-3xl mb-6"

          form_for TaskCategories::Create, class: "space-y-6" do
            # Category name
            mount UI::FormInput,
              label_text: r("task_categories.name").t,
              name: "task_category:name",
              value: operation.name.value.to_s,
              required: true

            # Color picker
            mount UI::FormInput,
              label_text: r("task_categories.color").t + " (" + r("guests.notes_optional").t.downcase + ")",
              name: "task_category:color",
              value: operation.color.value || "#3B82F6",
              input_type: "color"

            # Actions
            div class: "card-actions justify-end mt-8" do
              link r("actions.cancel").t, to: TaskCategories::Index, class: "btn btn-ghost"
              button r("actions.create").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
