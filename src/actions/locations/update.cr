class Locations::Update < BrowserAction
  put "/locations/:location_id" do
    location = LocationQuery.find(location_id)
    SaveLocation.update(location, params) do |operation, updated_location|
      if operation.saved?
        flash.success = "The record has been updated"
        redirect Show.with(updated_location.id)
      else
        flash.failure = "It looks like the form is not valid"
        html EditPage, operation: operation, location: updated_location
      end
    end
  end
end
