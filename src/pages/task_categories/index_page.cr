class TaskCategories::IndexPage < MainLayout
  needs categories : Array(TaskCategory)

  def page_title
    r("task_categories.title").t
  end

  def content
    div class: "container mx-auto px-4 py-8" do
      div class: "flex justify-between items-center mb-8" do
        h1 r("task_categories.title").t, class: "text-4xl font-bold"
        link r("task_categories.new").t, to: TaskCategories::New, class: "btn btn-primary"
      end

      if categories.empty?
        render_empty_state
      else
        div class: "grid gap-6" do
          categories.each do |category|
            render_category_card(category)
          end
        end
      end
    end
  end

  private def render_empty_state
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body text-center py-12" do
        icon "tag", "w-16 h-16 mx-auto mb-4 text-base-content/40"
        h2 r("task_categories.no_categories").t, class: "text-2xl font-bold mb-2"
        link r("task_categories.new").t, to: TaskCategories::New, class: "btn btn-primary mt-4"
      end
    end
  end

  private def render_category_card(category : TaskCategory)
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center justify-between" do
          div class: "flex items-center gap-3" do
            if color = category.color
              span class: "w-6 h-6 rounded-full", style: "background-color: #{color};"
            end
            h2 category.name, class: "card-title"
            if category.is_default
              span r("task_categories.default_categories").t, class: "badge badge-sm badge-ghost"
            end
          end

          unless category.is_default
            div class: "card-actions" do
              link r("actions.edit").t, to: TaskCategories::Edit.with(category.id), class: "btn btn-sm btn-ghost"
              form_for TaskCategories::Delete.with(category.id), class: "inline" do
                button type: "submit", class: "btn btn-sm btn-ghost btn-square", data_confirm: r("actions.confirm_delete").t do
                  icon "trash", "w-4 h-4"
                end
              end
            end
          end
        end
      end
    end
  end
end
