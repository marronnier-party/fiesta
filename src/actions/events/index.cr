class Events::Index < BrowserAction
  include Rosetta::Translatable

  get "/events" do
    query = EventQuery.new
      .for_user(current_user)
      .preload_location
      .ordered_by_date

    # Add search filter if provided
    if search_query = params.get?("search")
      unless search_query.empty?
        query = query.name.ilike("%#{search_query}%")
      end
    end

    events = query.results

    # Check view mode
    view_mode = params.get?("view") || "list"

    html IndexPage,
      events: events,
      search_query: params.get?("search"),
      view_mode: view_mode
  end
end
