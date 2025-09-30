class SaveTask < Task::SaveOperation
  permit_columns name, status, completed_at, position, category, notes, event_id, guest_id

  before_save do
    validate_required name, event_id
    set_completed_at
  end

  private def set_completed_at
    # Only process if this is a new record or if status has changed
    return unless record.nil? || status.changed?

    if status.value == Task::Status::Completed
      completed_at.value = Time.utc
    else
      # Clear completed_at if status changes away from Completed
      completed_at.value = nil
    end
  end
end
