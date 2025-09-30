class SaveTaskCategory < TaskCategory::SaveOperation
  permit_columns name, color, is_default, user_id

  before_save do
    validate_required name
    validate_size_of name, min: 1, max: 50
  end
end
