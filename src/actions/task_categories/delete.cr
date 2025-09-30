class TaskCategories::Delete < BrowserAction
  delete "/task_categories/:task_category_id" do
    category = TaskCategoryQuery.new
      .for_user(current_user)
      .find(task_category_id)

    # Don't allow deletion of default categories
    if category.is_default
      flash.failure = r("task_categories.cannot_delete_default").t
      redirect to: TaskCategories::Index
    else
      category.delete
      flash.success = r("task_categories.deleted").t
      redirect to: TaskCategories::Index
    end
  end
end
