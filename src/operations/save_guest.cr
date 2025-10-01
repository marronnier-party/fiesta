class SaveGuest < Guest::SaveOperation
  permit_columns status, guest_count, notes, answered_at, confirmed_at, declined_at, cancelled_at, user_id, event_id

  before_save do
    validate_required user_id, event_id
    set_status_timestamps
  end

  private def set_status_timestamps
    # Only set timestamps if status is being set
    return unless status.changed?

    case status.value
    when Guest::Status::Confirmed
      confirmed_at.value = Time.utc if confirmed_at.value.nil?
      answered_at.value = Time.utc if answered_at.value.nil?
    when Guest::Status::Declined
      declined_at.value = Time.utc if declined_at.value.nil?
      answered_at.value = Time.utc if answered_at.value.nil?
    when Guest::Status::Cancelled
      cancelled_at.value = Time.utc if cancelled_at.value.nil?
    end

    # Set answered_at any time status changes from NoAnswer to something else
    if record && record.not_nil!.status == Guest::Status::NoAnswer && status.value != Guest::Status::NoAnswer
      answered_at.value = Time.utc if answered_at.value.nil?
    end
  end
end
