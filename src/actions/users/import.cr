class Users::Import < BrowserAction
  get "/users/import" do
    html ImportPage
  end
end
