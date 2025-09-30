class SaveGuest < Guest::SaveOperation
  permit_columns status, guest_count, notes, answered_at, confirmed_at, declined_at, cancelled_at, user_id, event_id

  before_save do
    validate_required user_id, event_id
    validate_guest_count
    set_timestamp_based_on_status
  end

  private def validate_guest_count
    return unless guest_count.value

    if guest_count.value.not_nil! < 1
      guest_count.add_error "must be at least 1"
    elsif guest_count.value.not_nil! > 50
      guest_count.add_error "must be 50 or less"
    end
  end

  private def set_timestamp_based_on_status
    # Only process if this is a new record or if status has changed
    return unless record.nil? || status.changed?

    case status.value
    when Guest::Status::Confirmed
      confirmed_at.value = Time.utc
      answered_at.value = Time.utc if answered_at.value.nil?
    when Guest::Status::Declined
      declined_at.value = Time.utc
      answered_at.value = Time.utc if answered_at.value.nil?
    when Guest::Status::Cancelled
      cancelled_at.value = Time.utc
      answered_at.value = Time.utc if answered_at.value.nil?
    end
  end
end
