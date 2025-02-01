class Locations::Edit < BrowserAction
  get "/locations/:location_id/edit" do
    location = LocationQuery.find(location_id)
    html EditPage,
      operation: SaveLocation.new(location),
      location: location
  end
end
