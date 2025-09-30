module RequireLocationOwnership
  macro included
    before verify_location_ownership
  end

  private def verify_location_ownership
    return continue if location.creator_id == current_user.id

    response.status_code = 403
    html Errors::ShowPage, message: "You can only modify your own locations", status_code: 403
  end
end