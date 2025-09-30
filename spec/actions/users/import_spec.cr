require "../../spec_helper"

describe Users::Import do
  it "shows import page" do
    user = UserFactory.create

    response = ApiClient.auth(user).exec(Users::Import, backdoor_user_id: user.id)

    response.status.should eq(HTTP::Status::OK)
    response.body.should contain("Import")
  end

  it "requires authentication" do
    response = ApiClient.exec(Users::Import)

    response.status.should eq(HTTP::Status::FOUND)
    response.headers["Location"].should contain("/sign_in")
  end
end
