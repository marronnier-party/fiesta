class Events::Edit < BrowserAction
  include RequireEventFromId
  include RequireEventOwnership

  get "/events/:event_id/edit" do
    html EditPage,
      operation: SaveEvent.new(event),
      event: event
  end
end
