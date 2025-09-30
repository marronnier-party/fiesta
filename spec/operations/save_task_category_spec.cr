require "../spec_helper"

describe SaveTaskCategory do
  it "saves with valid attributes" do
    user = UserFactory.create

    operation = SaveTaskCategory.create!(
      name: "Food",
      color: "#FF5733",
      is_default: false,
      user_id: user.id
    )

    operation.saved?.should be_true
    operation.record.name.should eq("Food")
    operation.record.color.should eq("#FF5733")
    operation.record.is_default.should be_false
  end

  it "requires name" do
    user = UserFactory.create

    operation = SaveTaskCategory.create(
      name: "",
      user_id: user.id
    )

    operation.saved?.should be_false
    operation.name.errors.should_not be_empty
  end

  it "enforces max length on name" do
    user = UserFactory.create
    long_name = "a" * 51

    operation = SaveTaskCategory.create(
      name: long_name,
      user_id: user.id
    )

    operation.saved?.should be_false
    operation.name.errors.should_not be_empty
  end
end
