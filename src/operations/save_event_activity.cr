class SaveEventActivity < EventActivity::SaveOperation
  permit_columns event_id, user_id, activity_type, description
end
