class SaveEventTemplate < EventTemplate::SaveOperation
  permit_columns name, description, location_id, creator_id, task_templates, default_guest_ids

  before_save do
    validate_required name
    validate_size_of name, min: 1, max: 200
  end
end
