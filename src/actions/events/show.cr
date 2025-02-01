class Events::Show < BrowserAction
  get "/events/:event_id" do
    html ShowPage, event: EventQuery.find(event_id)
  end
end
