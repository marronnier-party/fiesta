class Guests::Create < BrowserAction
  post "/guests" do
    SaveGuest.create(params) do |operation, guest|
      if guest
        flash.success = "The record has been saved"
        redirect Show.with(guest.id)
      else
        flash.failure = "It looks like the form is not valid"
        html NewPage, operation: operation
      end
    end
  end
end
