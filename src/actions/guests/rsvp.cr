class Guests::Rsvp < BrowserAction
  include RequireGuestFromId

  get "/guests/:guest_id/rsvp" do
    # Ensure the guest belongs to the current user
    if guest.user_id != current_user.id
      flash.failure = r("guests.not_authorized").t
      redirect to: Me::Show
    end

    # Preload event and location for the page
    loaded_guest = GuestQuery.new
      .id(guest.id)
      .preload_event(EventQuery.new.preload_location)
      .first

    html RsvpPage, guest: loaded_guest
  end

  post "/guests/:guest_id/rsvp" do
    # Ensure the guest belongs to the current user
    if guest.user_id != current_user.id
      flash.failure = r("guests.not_authorized").t
      redirect to: Me::Show
    end

    # Update guest status
    SaveGuest.update(guest, params) do |operation, updated_guest|
      if operation.saved?
        flash.success = r("guests.rsvp_saved").t
        redirect to: Me::Show
      else
        flash.failure = r("guests.rsvp_failed").t
        # Preload for error display
        loaded_guest = GuestQuery.new
          .id(guest.id)
          .preload_event(EventQuery.new.preload_location)
          .first
        html RsvpPage, guest: loaded_guest, save_operation: operation
      end
    end
  end
end
