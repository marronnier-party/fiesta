class DependentGuests::Manage < BrowserAction
  include RequireGuestFromId

  get "/guests/:guest_id/dependent_guests" do
    # Only the guest themselves can manage their dependent guests
    if guest.user_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Me::Show
    end

    dependent_guests = DependentGuestQuery.new.for_guest(guest).results

    html DependentGuests::ManagePage,
      guest: guest,
      dependent_guests: dependent_guests
  end
end
