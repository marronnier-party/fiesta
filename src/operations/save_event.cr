class SaveEvent < Event::SaveOperation
  permit_columns name, description, organizer_notes, status, start_at, end_at, creator_id, location_id, budget

  before_save do
    validate_required name
    validate_future_date
    validate_end_after_start

    Avram::Slugify.set slug,
      using: name,
      query: EventQuery.new.creator_id(creator_id.value || 0)
  end

  private def validate_future_date
    # Only validate future date if event is being confirmed (not draft)
    return unless status.value == Event::Status::Confirmed
    return unless start_at.value

    if start_at.value.not_nil! < Time.utc
      start_at.add_error "must be in the future for confirmed events"
    end
  end

  private def validate_end_after_start
    return unless start_at.value && end_at.value

    if end_at.value.not_nil! <= start_at.value.not_nil!
      end_at.add_error "must be after start date"
    end
  end
end
