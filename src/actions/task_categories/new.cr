class TaskCategories::New < BrowserAction
  get "/task_categories/new" do
    html NewPage, operation: SaveTaskCategory.new
  end
end
