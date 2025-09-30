class Locations::Edit < BrowserAction
  include RequireLocationFromId
  include RequireLocationOwnership

  get "/locations/:location_id/edit" do
    html EditPage,
      operation: SaveLocation.new(location),
      location: location
  end
end
