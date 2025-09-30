class CreateTaskCategories::V20250930211159 < Avram::Migrator::Migration::V1
  def migrate
    create table_for(TaskCategory) do
      primary_key id : Int64
      add_timestamps

      add name : String
      add color : String?
      add is_default : Bool, default: false
      add_belongs_to user : User, on_delete: :cascade
    end
  end

  def rollback
    drop table_for(TaskCategory)
  end
end
