class SaveEventMessage < EventMessage::SaveOperation
  permit_columns :content, :event_id, :user_id

  before_save do
    validate_required content, event_id, user_id
  end
end
