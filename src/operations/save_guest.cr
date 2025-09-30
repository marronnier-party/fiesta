class SaveGuest < Guest::SaveOperation
  permit_columns status, guest_count, notes, answered_at, confirmed_at, declined_at, cancelled_at, user_id, event_id

  before_save do
    validate_required user_id, event_id
  end
end
