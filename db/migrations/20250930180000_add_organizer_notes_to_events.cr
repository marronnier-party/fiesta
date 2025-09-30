class AddOrganizerNotesToEvents::V20250930180000 < Avram::Migrator::Migration::V1
  def migrate
    alter table_for(Event) do
      add organizer_notes : String?, fill_existing_with: ""
    end
  end

  def rollback
    alter table_for(Event) do
      remove :organizer_notes
    end
  end
end
