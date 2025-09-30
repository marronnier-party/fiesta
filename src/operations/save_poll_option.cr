class SavePollOption < PollOption::SaveOperation
  permit_columns option_text

  before_save do
    validate_required option_text
    validate_size_of option_text, min: 1, max: 100
  end
end
