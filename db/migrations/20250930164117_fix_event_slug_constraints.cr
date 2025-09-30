class FixEventSlugConstraints::V20250930164117 < Avram::Migrator::Migration::V1
  def migrate
    # Remove global slug uniqueness and add per-creator uniqueness
    execute "DROP INDEX IF EXISTS events_slug_index;"
    execute "CREATE UNIQUE INDEX IF NOT EXISTS events_creator_slug_unique ON events (creator_id, slug);"

    execute "DROP INDEX IF EXISTS locations_slug_index;"
    execute "CREATE UNIQUE INDEX IF NOT EXISTS locations_creator_slug_unique ON locations (creator_id, slug);"
  end

  def rollback
    execute "DROP INDEX IF EXISTS events_creator_slug_unique;"
    execute "CREATE UNIQUE INDEX IF NOT EXISTS events_slug_index ON events (slug);"

    execute "DROP INDEX IF EXISTS locations_creator_slug_unique;"
    execute "CREATE UNIQUE INDEX IF NOT EXISTS locations_slug_index ON locations (slug);"
  end
end
