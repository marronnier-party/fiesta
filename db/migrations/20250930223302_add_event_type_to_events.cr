class AddEventTypeToEvents::V20250930223302 < Avram::Migrator::Migration::V1
  def migrate
    alter table_for(Event) do
      add event_type : String?, default: "other"
    end
  end

  def rollback
    alter table_for(Event) do
      remove :event_type
    end
  end
end
