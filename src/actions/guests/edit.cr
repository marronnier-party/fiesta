class Guests::Edit < BrowserAction
  get "/guests/:guest_id/edit" do
    guest = GuestQuery.find(guest_id)
    html EditPage,
      operation: SaveGuest.new(guest),
      guest: guest
  end
end
