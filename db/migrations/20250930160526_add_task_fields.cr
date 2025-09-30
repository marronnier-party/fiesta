class AddTaskFields::V20250930160526 < Avram::Migrator::Migration::V1
  def migrate
    alter table_for(Task) do
      add status : Int32, default: 0 # Pending = 0
      add completed_at : Time?
      add position : Int32, default: 0
      add category : String?
      add notes : String?
    end

    # Change foreign key to cascade delete
    execute "ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_event_id_fkey;"
    execute "ALTER TABLE tasks ADD CONSTRAINT tasks_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;"
  end

  def rollback
    alter table_for(Task) do
      remove :status
      remove :completed_at
      remove :position
      remove :category
      remove :notes
    end
  end
end
