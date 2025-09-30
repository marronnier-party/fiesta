require "../../spec_helper"

describe TaskCategories::Update do
  it "updates a task category successfully" do
    user = UserFactory.create
    category = TaskCategoryFactory.create &.user_id(user.id).name("Old Name")

    response = ApiClient.auth(user).exec(TaskCategories::Update.with(category.id), task_category: {
      name: "New Name",
      color: "#00FF00"
    })

    response.should redirect_to(TaskCategories::Index)

    updated = TaskCategoryQuery.new.find(category.id)
    updated.name.should eq("New Name")
    updated.color.should eq("#00FF00")
  end

  it "prevents user from updating another user's category" do
    user = UserFactory.create
    other_user = UserFactory.create
    category = TaskCategoryFactory.create &.user_id(other_user.id)

    expect_raises(Avram::RecordNotFoundError) do
      ApiClient.auth(user).exec(TaskCategories::Update.with(category.id), task_category: {
        name: "Hacked"
      })
    end
  end

  it "requires authentication" do
    category = TaskCategoryFactory.create

    response = ApiClient.exec(TaskCategories::Update.with(category.id), task_category: {
      name: "Test"
    })

    response.should redirect_to(SignIns::New)
  end
end
