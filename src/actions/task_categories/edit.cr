class TaskCategories::Edit < BrowserAction
  get "/task_categories/:task_category_id/edit" do
    category = TaskCategoryQuery.new
      .for_user(current_user)
      .find(task_category_id)

    html EditPage, operation: SaveTaskCategory.new(category), category: category
  end
end
