require "../spec_helper"

describe SaveTaskCategory do
  it "saves with valid attributes" do
    user = UserFactory.create

    category = SaveTaskCategory.create!(
      name: "Food",
      color: "#FF5733",
      is_default: false,
      user_id: user.id
    )

    category.name.should eq("Food")
    category.color.should eq("#FF5733")
    category.is_default.should be_false
  end

  it "requires name" do
    user = UserFactory.create

    SaveTaskCategory.create(
      name: "",
      user_id: user.id
    ) do |operation, category|
      operation.saved?.should be_false
      operation.name.errors.should_not be_empty
      category.should be_nil
    end
  end

  it "enforces max length on name" do
    user = UserFactory.create
    long_name = "a" * 51

    SaveTaskCategory.create(
      name: long_name,
      user_id: user.id
    ) do |operation, category|
      operation.saved?.should be_false
      operation.name.errors.should_not be_empty
      category.should be_nil
    end
  end
end
