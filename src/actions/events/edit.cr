class Events::Edit < BrowserAction
  get "/events/:event_id/edit" do
    event = EventQuery.find(event_id)
    html EditPage,
      operation: SaveEvent.new(event),
      event: event
  end
end
