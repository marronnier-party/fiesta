class Locations::New < BrowserAction
  get "/locations/new" do
    html NewPage, operation: SaveLocation.new
  end
end
