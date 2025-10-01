class Guests::UpdateStatus < BrowserAction
  put "/guests/:guest_id/status" do
    guest = GuestQuery.find(guest_id)
    event = guest.event!

    # Authorization check - only organizer can update guest status
    if event.creator_id != current_user.id
      if htmx_request?
        head 403
      else
        redirect_back fallback: Home::Index
      end
      return
    end

    # Parse and update status
    status_value = params.get("status")
    SaveGuest.update!(guest, status: Guest::Status.parse(status_value))

    if htmx_request?
      # Return just the updated guest row
      html Guests::GuestRow,
        guest: guest.reload,
        current_user: current_user,
        is_organizer: true,
        event: event
    else
      redirect_back fallback: Events::Show.with(guest.event_id)
    end
  end
end
