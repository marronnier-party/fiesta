class SaveComment < Comment::SaveOperation
  permit_columns content, commentable_type, commentable_id, user_id

  before_save do
    validate_required content
    validate_required commentable_type
    validate_required commentable_id
  end
end
