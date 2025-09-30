class CreateDependentGuests::V20250930171151 < Avram::Migrator::Migration::V1
  def migrate
    create table_for(DependentGuest) do
      primary_key id : Int64
      add_timestamps
      add name : String
      add age : Int32?
      add relationship : String?
      add dietary_restrictions : String?
      add_belongs_to guest : Guest, on_delete: :cascade
    end
  end

  def rollback
    drop table_for(DependentGuest)
  end
end
