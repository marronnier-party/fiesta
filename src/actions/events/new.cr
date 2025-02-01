class Events::New < BrowserAction
  get "/events/new" do
    html NewPage, operation: SaveEvent.new
  end
end
