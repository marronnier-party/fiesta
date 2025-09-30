class Guests::Rsvp < BrowserAction
  include RequireGuestFromId

  get "/guests/:guest_id/rsvp" do
    html RsvpPage, guest: guest
  end

  post "/guests/:guest_id/rsvp" do
    # Update guest status
    SaveGuest.update(guest, params) do |operation, updated_guest|
      if operation.saved?
        flash.success = "RSVP saved successfully!"
        redirect to: Me::Show
      else
        flash.failure = "Could not save RSVP"
        html RsvpPage, guest: guest, save_operation: operation
      end
    end
  end
end
