require "../../spec_helper"

describe TaskCategories::Index do
  it "shows user's task categories" do
    user = UserFactory.create
    category1 = TaskCategoryFactory.create &.user_id(user.id).name("Food")
    category2 = TaskCategoryFactory.create &.user_id(user.id).name("Beverages")
    other_user_category = TaskCategoryFactory.create &.name("Other User Category")

    response = ApiClient.auth(user).exec(TaskCategories::Index)

    response.status.should eq(200)
    response.body.should contain("Food")
    response.body.should contain("Beverages")
    response.body.should_not contain("Other User Category")
  end

  it "shows empty state when no categories" do
    user = UserFactory.create

    response = ApiClient.auth(user).exec(TaskCategories::Index)

    response.status.should eq(200)
    response.body.should contain(r("task_categories.no_categories").t)
  end

  it "requires authentication" do
    response = ApiClient.exec(TaskCategories::Index)

    response.should redirect_to(SignIns::New)
  end
end
