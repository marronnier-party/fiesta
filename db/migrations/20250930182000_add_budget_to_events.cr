class AddBudgetToEvents::V20250930182000 < Avram::Migrator::Migration::V1
  def migrate
    alter table_for(Event) do
      add budget : Float64?, default: nil
    end
  end

  def rollback
    alter table_for(Event) do
      remove :budget
    end
  end
end
