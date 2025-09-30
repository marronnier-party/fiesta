class CreateSecretSantaAssignments::V20250930233635 < Avram::Migrator::Migration::V1
  def migrate
    create table_for(SecretSantaAssignment) do
      primary_key id : Int64
      add_timestamps
      add_belongs_to secret_santa : SecretSanta, on_delete: :cascade

      add giver_id : Int64
      add receiver_id : Int64
      add status : String, default: "Pending"
      add notes : String?
    end

    execute "ALTER TABLE secret_santa_assignments ADD CONSTRAINT fk_giver FOREIGN KEY (giver_id) REFERENCES guests(id) ON DELETE CASCADE"
    execute "ALTER TABLE secret_santa_assignments ADD CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES guests(id) ON DELETE CASCADE"
  end

  def rollback
    drop table_for(SecretSantaAssignment)
  end
end
