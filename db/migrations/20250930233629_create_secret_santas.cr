class CreateSecretSantas::V20250930233629 < Avram::Migrator::Migration::V1
  def migrate
    create table_for(SecretSanta) do
      primary_key id : Int64
      add_timestamps
      add_belongs_to event : Event, on_delete: :cascade

      add gift_budget : Float64?
      add rules : String?
      add assignments_locked : Bool, default: false
      add reveal_date : Time?
    end
  end

  def rollback
    drop table_for(SecretSanta)
  end
end
