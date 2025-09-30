class TaskCategories::EditPage < MainLayout
  needs operation : SaveTaskCategory
  needs category : TaskCategory

  def page_title
    r("task_categories.edit").t
  end

  def content
    div class: "max-w-2xl mx-auto px-4 py-8" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("task_categories.edit").t, class: "card-title text-3xl mb-6"

          form_for TaskCategories::Update.with(category.id), class: "space-y-6" do
            # Category name
            div class: "form-control" do
              label r("task_categories.name").t, class: "label font-semibold"
              input type: "text",
                name: "task_category:name",
                value: operation.name.value.to_s,
                class: "input input-bordered w-full",
                required: true
            end

            # Color picker
            div class: "form-control" do
              label r("task_categories.color").t + " (" + r("guests.notes_optional").t.downcase + ")", class: "label font-semibold"
              input type: "color",
                name: "task_category:color",
                value: operation.color.value || "#3B82F6",
                class: "input input-bordered w-full h-12"
            end

            # Actions
            div class: "card-actions justify-end mt-8" do
              link r("actions.cancel").t, to: TaskCategories::Index, class: "btn btn-ghost"
              button r("actions.update").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
