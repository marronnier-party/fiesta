class Locations::Delete < BrowserAction
  delete "/locations/:location_id" do
    location = LocationQuery.find(location_id)
    DeleteLocation.delete(location) do |_operation, _deleted|
      flash.success = "Deleted the location"
      redirect Index
    end
  end
end
