class TaskCategories::Create < BrowserAction
  post "/task_categories" do
    SaveTaskCategory.create(params, user_id: current_user.id) do |operation, category|
      if category
        flash.success = r("task_categories.created").t
        redirect to: TaskCategories::Index
      else
        flash.failure = r("task_categories.create_failed").t
        html NewPage, operation: operation
      end
    end
  end
end
