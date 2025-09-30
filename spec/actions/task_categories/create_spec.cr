require "../../spec_helper"

describe TaskCategories::Create do
  it "creates a task category successfully" do
    user = UserFactory.create

    response = ApiClient.auth(user).exec(TaskCategories::Create, task_category: {
      name: "Custom Category",
      color: "#FF5733"
    })

    response.should redirect_to(TaskCategories::Index)

    category = TaskCategoryQuery.new.for_user(user).first
    category.name.should eq("Custom Category")
    category.color.should eq("#FF5733")
    category.is_default.should be_false
  end

  it "fails when name is blank" do
    user = UserFactory.create

    response = ApiClient.auth(user).exec(TaskCategories::Create, task_category: {
      name: ""
    })

    response.status.should eq(200)
    response.body.should contain(r("task_categories.create_failed").t)
  end

  it "requires authentication" do
    response = ApiClient.exec(TaskCategories::Create, task_category: {
      name: "Test"
    })

    response.should redirect_to(SignIns::New)
  end
end
