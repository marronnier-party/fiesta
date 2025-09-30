class Profile::Update < BrowserAction
  include Auth::RequireSignIn
  include Rosetta::Translatable

  post "/profile" do
    UpdateUserProfile.update(current_user, params) do |operation, updated_user|
      if updated_user
        flash.success = r("profile.updated_successfully").t
        redirect to: Profile::Show
      else
        flash.failure = r("profile.update_failed").t
        html EditPage, user: current_user
      end
    end
  end
end
