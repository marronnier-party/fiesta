class CreateEventTemplates::V20250930213337 < Avram::Migrator::Migration::V1
  def migrate
    create table_for(EventTemplate) do
      primary_key id : Int64
      add_timestamps

      add name : String
      add description : String?
      add_belongs_to location : Location?, on_delete: :nullify
      add_belongs_to creator : User, on_delete: :cascade

      # Store task templates and guest list as JSON
      add task_templates : String?, default: "[]" # JSON array
      add default_guest_ids : String?, default: "[]" # JSON array of user IDs
    end
  end

  def rollback
    drop table_for(EventTemplate)
  end
end
