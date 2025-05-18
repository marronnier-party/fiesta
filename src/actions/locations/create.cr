class Locations::Create < BrowserAction
  post "/locations" do
    SaveLocation.create(params) do |operation, location|
      if location
        flash.success = "The record has been saved"
        redirect Show.with(location.id)
      else
        flash.failure = "It looks like the form is not valid"
        redirect to: Locations::Wizard::New
      end
    end
  end
end
