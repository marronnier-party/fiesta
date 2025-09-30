class TaskCategories::Index < BrowserAction
  get "/task_categories" do
    categories = TaskCategoryQuery.new
      .for_user(current_user)
      .ordered_by_name
      .results

    html IndexPage, categories: categories
  end
end
