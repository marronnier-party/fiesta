class Guests::New < BrowserAction
  get "/guests/new" do
    html NewPage, operation: SaveGuest.new
  end
end
