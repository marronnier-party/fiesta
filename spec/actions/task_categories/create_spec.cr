require "../../spec_helper"

describe TaskCategories::Create do
  it "creates a task category successfully" do
    user = UserFactory.create

    response = ApiClient.auth(user).exec(TaskCategories::Create,
      backdoor_user_id: user.id,
      task_category: {
        name: "Custom Category",
        color: "#FF5733"
      }
    )

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/task_categories")

    category = TaskCategoryQuery.new.for_user(user).first
    category.name.should eq("Custom Category")
    category.color.should eq("#FF5733")
    category.is_default.should be_false
  end

  it "fails when name is blank" do
    user = UserFactory.create

    response = ApiClient.auth(user).exec(TaskCategories::Create,
      backdoor_user_id: user.id,
      task_category: {
        name: ""
      }
    )

    response.status.should eq(HTTP::Status::OK)
    # Flash message will be shown on the form
    TaskCategoryQuery.new.for_user(user).results.size.should eq(0)
  end

  it "requires authentication" do
    response = ApiClient.exec(TaskCategories::Create, task_category: {
      name: "Test"
    })

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
