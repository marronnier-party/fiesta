class Locations::New < BrowserAction
  get "/locations/new" do
    redirect to: Locations::Wizard::New.with(
      current_step: 1,
      # location_id: location_id,
      # parent_event_id: parent_event_id
    )
  end
end
