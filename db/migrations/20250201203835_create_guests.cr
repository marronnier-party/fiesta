class CreateGuests::V20250201203835 < Avram::Migrator::Migration::V1
  def migrate
    # Learn about migrations at: https://luckyframework.org/guides/database/migrations
    create table_for(Guest) do
      primary_key id : Int64
      add_timestamps
      add status : Int32
      add answered_at : Time?
      add confirmed_at : Time?
      add declined_at : Time?
      add cancelled_at : Time?

      add_belongs_to user : User, on_delete: :nullify
      add_belongs_to event : Event, on_delete: :nullify
    end
  end

  def rollback
    drop table_for(Guest)
  end
end
