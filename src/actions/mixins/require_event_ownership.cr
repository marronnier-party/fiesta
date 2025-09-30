module RequireEventOwnership
  macro included
    before verify_event_ownership
  end

  private def verify_event_ownership
    return continue if event.creator_id == current_user.id

    response.status_code = 403
    html Errors::ShowPage, message: "You can only modify your own events", status_code: 403
  end
end