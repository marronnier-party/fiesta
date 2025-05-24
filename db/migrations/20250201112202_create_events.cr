class CreateEvents::V20250201112202 < Avram::Migrator::Migration::V1
  def migrate
    # Learn about migrations at: https://luckyframework.org/guides/database/migrations
    create table_for(Event) do
      primary_key id : Int64
      add_timestamps
      add name : String, unique: true
      add slug : String, unique: true, index: true
      add description : String?
      add_belongs_to creator : User, on_delete: :restrict

      add status : Int32
      add start_at : Time?
      add end_at : Time?
      add total_cost : Float64?
    end
  end

  def rollback
    drop table_for(Event)
  end
end
