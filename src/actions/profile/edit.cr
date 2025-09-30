class Profile::Edit < BrowserAction
  include Auth::RequireSignIn
  include Rosetta::Translatable

  get "/profile/edit" do
    html EditPage, user: current_user
  end
end
