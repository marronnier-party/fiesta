class Guests::Show < BrowserAction
  get "/guests/:guest_id" do
    html ShowPage, guest: GuestQuery.find(guest_id)
  end
end
