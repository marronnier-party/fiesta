require "../../spec_helper"

describe TaskCategories::Delete do
  it "deletes a custom category successfully" do
    user = UserFactory.create
    category = TaskCategoryFactory.create &.user_id(user.id).is_default(false)

    response = ApiClient.auth(user).exec(TaskCategories::Delete.with(category.id), backdoor_user_id: user.id)

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/task_categories")

    TaskCategoryQuery.new.id(category.id).first?.should be_nil
  end

  it "prevents deletion of default categories" do
    user = UserFactory.create
    category = TaskCategoryFactory.create &.user_id(user.id).is_default(true)

    response = ApiClient.auth(user).exec(TaskCategories::Delete.with(category.id), backdoor_user_id: user.id)

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/task_categories")

    # Category should still exist
    TaskCategoryQuery.new.id(category.id).first?.should_not be_nil
  end

  it "prevents user from deleting another user's category" do
    user = UserFactory.create
    other_user = UserFactory.create
    category = TaskCategoryFactory.create &.user_id(other_user.id)

    # Should raise 404 or return error, category should still exist
    begin
      response = ApiClient.auth(user).exec(TaskCategories::Delete.with(category.id), backdoor_user_id: user.id)
      response.status.should_not eq(HTTP::Status::FOUND) # Should not succeed
    rescue Avram::RecordNotFoundError
      # This is also acceptable - the query raised an error
    end

    # Category should still exist
    TaskCategoryQuery.new.id(category.id).first?.should_not be_nil
  end

  it "requires authentication" do
    category = TaskCategoryFactory.create

    response = ApiClient.exec(TaskCategories::Delete.with(category.id))

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
