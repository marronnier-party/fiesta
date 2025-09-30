class CreateEventActivities::V20250930181000 < Avram::Migrator::Migration::V1
  def migrate
    create table_for(EventActivity) do
      primary_key id : Int64
      add_timestamps
      add event_id : Int64
      add user_id : Int64
      add activity_type : String
      add description : String
    end
  end

  def rollback
    drop table_for(EventActivity)
  end
end
