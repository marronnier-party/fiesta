class EventTemplates::New < BrowserAction
  get "/event_templates/new" do
    locations = LocationQuery.new.for_user(current_user).results
    html NewPage, operation: SaveEventTemplate.new, locations: locations
  end
end
