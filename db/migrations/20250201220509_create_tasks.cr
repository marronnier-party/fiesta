class CreateTasks::V20250201220509 < Avram::Migrator::Migration::V1
  def migrate
    # Learn about migrations at: https://luckyframework.org/guides/database/migrations
    create table_for(Task) do
      primary_key id : Int64
      add_timestamps
      add name : String
      add_belongs_to event : Event, on_delete: :nullify
      add_belongs_to guest : Guest?, on_delete: :nullify
    end
  end

  def rollback
    drop table_for(Task)
  end
end
