class SavePoll < Poll::SaveOperation
  permit_columns question, is_locked

  before_save do
    validate_required question
    validate_size_of question, min: 5, max: 200
  end
end
