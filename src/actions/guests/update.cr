class Guests::Update < BrowserAction
  put "/guests/:guest_id" do
    guest = GuestQuery.find(guest_id)
    SaveGuest.update(guest, params) do |operation, updated_guest|
      if operation.saved?
        flash.success = "The record has been updated"
        redirect Show.with(updated_guest.id)
      else
        flash.failure = "It looks like the form is not valid"
        html EditPage, operation: operation, guest: updated_guest
      end
    end
  end
end
