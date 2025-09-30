class Locations::New < BrowserAction
  get "/locations/new" do
    html NewPage, save_operation: SaveLocation.new
  end
end
