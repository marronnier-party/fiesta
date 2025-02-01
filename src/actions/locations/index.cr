class Locations::Index < BrowserAction
  get "/locations" do
    html IndexPage, locations: LocationQuery.new
  end
end
