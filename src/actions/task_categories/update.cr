class TaskCategories::Update < BrowserAction
  patch "/task_categories/:task_category_id" do
    category = TaskCategoryQuery.new
      .for_user(current_user)
      .find(task_category_id)

    SaveTaskCategory.update(category, params) do |operation, updated_category|
      if updated_category
        flash.success = r("task_categories.updated").t
        redirect to: TaskCategories::Index
      else
        flash.failure = r("task_categories.update_failed").t
        html EditPage, operation: operation, category: category
      end
    end
  end
end
