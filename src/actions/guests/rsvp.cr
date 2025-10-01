class Guests::Rsvp < BrowserAction
  include RequireGuestFromId

  private def load_guest_with_event(guest : Guest)
    GuestQuery.new
      .id(guest.id)
      .preload_event(EventQuery.new.preload_location)
      .first
  end

  get "/guests/:guest_id/rsvp" do
    authorize guest, policy: GuestPolicy, query: :rsvp?

    loaded_guest = load_guest_with_event(guest)
    html RsvpPage, guest: loaded_guest
  end

  post "/guests/:guest_id/rsvp" do
    authorize guest, policy: GuestPolicy, query: :rsvp?

    # Update guest status
    SaveGuest.update(guest, params) do |operation, updated_guest|
      if operation.saved?
        flash.success = r("guests.rsvp_saved").t
        redirect to: Me::Show
      else
        flash.failure = r("guests.rsvp_failed").t
        loaded_guest = load_guest_with_event(guest)
        html RsvpPage, guest: loaded_guest, save_operation: operation
      end
    end
  end
end
