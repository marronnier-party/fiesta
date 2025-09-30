require "../../spec_helper"

describe TaskCategories::Delete do
  it "deletes a custom category successfully" do
    user = UserFactory.create
    category = TaskCategoryFactory.create &.user_id(user.id).is_default(false)

    response = ApiClient.auth(user).exec(TaskCategories::Delete.with(category.id))

    response.should redirect_to(TaskCategories::Index)

    TaskCategoryQuery.new.id(category.id).first?.should be_nil
  end

  it "prevents deletion of default categories" do
    user = UserFactory.create
    category = TaskCategoryFactory.create &.user_id(user.id).is_default(true)

    response = ApiClient.auth(user).exec(TaskCategories::Delete.with(category.id))

    response.should redirect_to(TaskCategories::Index)

    # Category should still exist
    TaskCategoryQuery.new.id(category.id).first?.should_not be_nil
  end

  it "prevents user from deleting another user's category" do
    user = UserFactory.create
    other_user = UserFactory.create
    category = TaskCategoryFactory.create &.user_id(other_user.id)

    expect_raises(Avram::RecordNotFoundError) do
      ApiClient.auth(user).exec(TaskCategories::Delete.with(category.id))
    end
  end

  it "requires authentication" do
    category = TaskCategoryFactory.create

    response = ApiClient.exec(TaskCategories::Delete.with(category.id))

    response.should redirect_to(SignIns::New)
  end
end
