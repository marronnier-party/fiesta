class CreateNotifications::V20250930233637 < Avram::Migrator::Migration::V1
  def migrate
    create table_for(Notification) do
      primary_key id : Int64
      add_timestamps
      add_belongs_to user : User, on_delete: :cascade

      add event_id : Int64?
      add notification_type : String
      add status : String, default: "Pending"
      add title : String
      add message : String
      add scheduled_for : Time?
      add sent_at : Time?
    end

    execute "ALTER TABLE notifications ADD CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE"
    create_index table_for(Notification), [:status], unique: false
  end

  def rollback
    drop table_for(Notification)
  end
end
