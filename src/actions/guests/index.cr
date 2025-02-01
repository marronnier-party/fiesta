class Guests::Index < BrowserAction
  get "/guests" do
    html IndexPage, guests: GuestQuery.new
  end
end
