class CreateEventMessages::V20250930233636 < Avram::Migrator::Migration::V1
  def migrate
    create table_for(EventMessage) do
      primary_key id : Int64
      add_timestamps
      add_belongs_to event : Event, on_delete: :cascade
      add_belongs_to user : User, on_delete: :cascade

      add content : String
    end
  end

  def rollback
    drop table_for(EventMessage)
  end
end
