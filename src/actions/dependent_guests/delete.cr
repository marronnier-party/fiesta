class DependentGuests::Delete < BrowserAction
  include RequireGuestFromId

  delete "/guests/:guest_id/dependent_guests/:dependent_guest_id" do
    # Only the guest themselves can delete dependent guests
    if guest.user_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Me::Show
    end

    dependent_guest = DependentGuestQuery.new
      .for_guest(guest)
      .find(dependent_guest_id)

    dependent_guest.delete

    flash.success = r("dependent_guests.deleted").t
    redirect to: DependentGuests::Manage.with(guest.id)
  end
end
