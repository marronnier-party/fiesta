require "../spec_helper"

describe TaskCategoryQuery do
  describe "for_user" do
    it "returns only the user's categories" do
      user1 = UserFactory.create
      user2 = UserFactory.create
      cat1 = TaskCategoryFactory.create &.user_id(user1.id).name("User 1 Category")
      cat2 = TaskCategoryFactory.create &.user_id(user2.id).name("User 2 Category")

      results = TaskCategoryQuery.new.for_user(user1).results

      results.should contain(cat1)
      results.should_not contain(cat2)
    end
  end

  describe "ordered_by_name" do
    it "orders categories alphabetically" do
      user = UserFactory.create
      zebra = TaskCategoryFactory.create &.user_id(user.id).name("Zebra")
      alpha = TaskCategoryFactory.create &.user_id(user.id).name("Alpha")
      beta = TaskCategoryFactory.create &.user_id(user.id).name("Beta")

      results = TaskCategoryQuery.new.for_user(user).ordered_by_name.results

      results[0].should eq(alpha)
      results[1].should eq(beta)
      results[2].should eq(zebra)
    end
  end

  describe "default_categories" do
    it "returns only default categories" do
      user = UserFactory.create
      default = TaskCategoryFactory.create &.user_id(user.id).is_default(true)
      custom = TaskCategoryFactory.create &.user_id(user.id).is_default(false)

      results = TaskCategoryQuery.new.for_user(user).default_categories.results

      results.should contain(default)
      results.should_not contain(custom)
    end
  end

  describe "custom_categories" do
    it "returns only custom categories" do
      user = UserFactory.create
      default = TaskCategoryFactory.create &.user_id(user.id).is_default(true)
      custom = TaskCategoryFactory.create &.user_id(user.id).is_default(false)

      results = TaskCategoryQuery.new.for_user(user).custom_categories.results

      results.should contain(custom)
      results.should_not contain(default)
    end
  end
end
