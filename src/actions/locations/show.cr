class Locations::Show < BrowserAction
  get "/locations/:location_id" do
    html ShowPage, location: LocationQuery.find(location_id)
  end
end
