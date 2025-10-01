class AddCostToTasks::V20251001011133 < Avram::Migrator::Migration::V1
  def migrate
    alter table_for(Task) do
      add cost : Float64?
    end
  end

  def rollback
    alter table_for(Task) do
      remove :cost
    end
  end
end
