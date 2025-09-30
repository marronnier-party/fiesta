require "../../spec_helper"

describe TaskCategories::Update do
  it "updates a task category successfully" do
    user = UserFactory.create
    category = TaskCategoryFactory.create &.user_id(user.id).name("Old Name")

    response = ApiClient.auth(user).exec(TaskCategories::Update.with(category.id),
      backdoor_user_id: user.id,
      task_category: {
        name: "New Name",
        color: "#00FF00"
      }
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/task_categories")

    updated = TaskCategoryQuery.new.find(category.id)
    updated.name.should eq("New Name")
    updated.color.should eq("#00FF00")
  end

  it "prevents user from updating another user's category" do
    user = UserFactory.create
    other_user = UserFactory.create
    category = TaskCategoryFactory.create &.user_id(other_user.id).name("Original")

    # Should raise 404 or return error, category should not be updated
    begin
      response = ApiClient.auth(user).exec(TaskCategories::Update.with(category.id),
        backdoor_user_id: user.id,
        task_category: {
          name: "Hacked"
        }
      )
      response.status.should_not eq(HTTP::Status::FOUND) # Should not succeed
    rescue Avram::RecordNotFoundError
      # This is also acceptable - the query raised an error
    end

    # Category should not be updated
    updated = TaskCategoryQuery.new.id(category.id).first
    updated.name.should eq("Original")
  end

  it "requires authentication" do
    category = TaskCategoryFactory.create

    response = ApiClient.exec(TaskCategories::Update.with(category.id), task_category: {
      name: "Test"
    })

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
