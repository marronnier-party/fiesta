class FixDatabaseConstraints::V20250930160343 < Avram::Migrator::Migration::V1
  def migrate
    # Add unique constraint to prevent duplicate guest invitations
    execute "CREATE UNIQUE INDEX IF NOT EXISTS guests_user_event_unique ON guests (user_id, event_id);"

    # Remove global uniqueness constraints and add per-creator uniqueness
    execute "DROP INDEX IF EXISTS events_name_index;"
    execute "CREATE UNIQUE INDEX IF NOT EXISTS events_creator_name_unique ON events (creator_id, name);"

    execute "DROP INDEX IF EXISTS locations_name_index;"
    execute "CREATE UNIQUE INDEX IF NOT EXISTS locations_creator_name_unique ON locations (creator_id, name);"
  end

  def rollback
    execute "DROP INDEX IF EXISTS guests_user_event_unique;"
    execute "DROP INDEX IF EXISTS events_creator_name_unique;"
    execute "CREATE UNIQUE INDEX IF NOT EXISTS events_name_index ON events (name);"
    execute "DROP INDEX IF EXISTS locations_creator_name_unique;"
    execute "CREATE UNIQUE INDEX IF NOT EXISTS locations_name_index ON locations (name);"
  end
end
