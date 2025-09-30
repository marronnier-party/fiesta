class Locations::Delete < BrowserAction
  include RequireLocationFromId
  include RequireLocationOwnership

  delete "/locations/:location_id" do
    DeleteLocation.delete(location) do |_operation, _deleted|
      flash.success = "Deleted the location"
      redirect Home::Index
    end
  end
end
