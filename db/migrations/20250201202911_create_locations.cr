class CreateLocations::V20250201202911 < Avram::Migrator::Migration::V1
  def migrate
    # Learn about migrations at: https://luckyframework.org/guides/database/migrations
    create table_for(Location) do
      primary_key id : Int64
      add_timestamps
      add name : String, unique: true
      add slug : String, unique: true, index: true
      add description : String
    end

    alter table_for(Event) do
      add_belongs_to location : Location?, on_delete: :nullify
    end
  end

  def rollback
    drop table_for(Location)
  end
end
