class SaveEvent < Event::SaveOperation
  permit_columns name, description, status, start_at, end_at, creator_id

  before_save do
    validate_required name
    validate_required start_at
    validate_required end_at
    validate_future_date
    validate_end_after_start
  end

  private def validate_future_date
    if start_at.value && start_at.value < Time.utc
      start_at.add_error "doit être dans le futur"
    end
  end

  private def validate_end_after_start
    return unless start_at.value && end_at.value
    if end_at.value <= start_at.value
      end_at.add_error "doit être après la date de début"
    end
  end
end
