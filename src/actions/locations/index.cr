class Locations::Index < BrowserAction
  include Auth::RequireSignIn
  include Rosetta::Translatable

  param search : String = ""

  get "/locations" do
    query = LocationQuery.new.creator_id(current_user.id)

    # Filter by search if provided
    unless search.blank?
      locations = query.results.select do |location|
        location.name.downcase.includes?(search.downcase) ||
          (location.address && location.address.not_nil!.downcase.includes?(search.downcase)) ||
          (location.city && location.city.not_nil!.downcase.includes?(search.downcase))
      end
    else
      locations = query.results
    end

    html IndexPage, locations: locations, search_query: search
  end
end
