require "../../spec_helper"

describe TaskCategories::Index do
  it "shows user's task categories" do
    user = UserFactory.create
    category1 = TaskCategoryFactory.create &.user_id(user.id).name("Food")
    category2 = TaskCategoryFactory.create &.user_id(user.id).name("Beverages")
    other_user_category = TaskCategoryFactory.create &.name("Other User Category")

    response = ApiClient.auth(user).exec(TaskCategories::Index, backdoor_user_id: user.id)

    response.status.should eq(HTTP::Status::OK)
    response.body.should contain("Food")
    response.body.should contain("Beverages")
    response.body.should_not contain("Other User Category")
  end

  it "shows empty state when no categories" do
    user = UserFactory.create

    response = ApiClient.auth(user).exec(TaskCategories::Index, backdoor_user_id: user.id)

    response.status.should eq(HTTP::Status::OK)
    # Check that there are no categories shown
    TaskCategoryQuery.new.for_user(user).results.size.should eq(0)
  end

  it "requires authentication" do
    response = ApiClient.exec(TaskCategories::Index)

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
