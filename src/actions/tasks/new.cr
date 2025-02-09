class Tasks::New < BrowserAction
  get "/tasks/new" do
    html NewPage, operation: SaveTask.new
  end
end
