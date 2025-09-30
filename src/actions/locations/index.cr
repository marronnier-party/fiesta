class Locations::Index < BrowserAction
  include Auth::RequireSignIn
  include Rosetta::Translatable

  get "/locations" do
    locations = LocationQuery.new.creator_id(current_user.id).results
    html IndexPage, locations: locations
  end
end
