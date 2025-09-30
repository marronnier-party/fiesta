class SaveSecretSanta < SecretSanta::SaveOperation
  permit_columns :gift_budget, :rules, :assignments_locked, :reveal_date, :event_id

  before_save do
    validate_required event_id
  end
end
