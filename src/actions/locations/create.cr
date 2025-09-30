class Locations::Create < BrowserAction
  post "/locations" do
    SaveLocation.create(params, creator_id: current_user.id) do |operation, location|
      if location
        flash.success = "Location created successfully!"
        redirect to: Events::New
      else
        flash.failure = "Could not create location"
        html Locations::NewPage, save_operation: operation
      end
    end
  end
end
