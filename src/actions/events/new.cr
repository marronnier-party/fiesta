class Events::New < BrowserAction
  get "/events/new" do
    html NewPage, save_operation: SaveEvent.new
  end
end
