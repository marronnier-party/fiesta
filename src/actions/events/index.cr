class Events::Index < BrowserAction
  get "/events" do
    html IndexPage, events: EventQuery.new
  end
end
