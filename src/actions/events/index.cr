class Events::Index < BrowserAction
  get "/events" do
    events = EventQuery.new
      .for_user(current_user)
      .preload_location
      .ordered_by_date
      .results

    html IndexPage, events: events
  end
end
