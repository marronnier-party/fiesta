class DependentGuests::Create < BrowserAction
  include RequireGuestFromId

  post "/guests/:guest_id/dependent_guests" do
    # Only the guest themselves can add dependent guests
    if guest.user_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Me::Show
    end

    SaveDependentGuest.create(params, guest_id: guest.id) do |operation, dependent_guest|
      if operation.saved?
        flash.success = r("dependent_guests.created").t
        redirect to: DependentGuests::Manage.with(guest.id)
      else
        dependent_guests = DependentGuestQuery.new.for_guest(guest).results
        flash.failure = r("dependent_guests.create_failed").t
        html DependentGuests::ManagePage,
          guest: guest,
          dependent_guests: dependent_guests,
          save_operation: operation
      end
    end
  end
end
