class Guests::Delete < BrowserAction
  delete "/guests/:guest_id" do
    guest = GuestQuery.find(guest_id)
    DeleteGuest.delete(guest) do |_operation, _deleted|
      flash.success = "Deleted the guest"
      redirect Index
    end
  end
end
