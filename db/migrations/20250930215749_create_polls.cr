class CreatePolls::V20250930215749 < Avram::Migrator::Migration::V1
  def migrate
    create table_for(Poll) do
      primary_key id : Int64
      add_timestamps

      add question : String
      add is_locked : Bool, default: false
      add_belongs_to event : Event, on_delete: :cascade
    end

    create table_for(PollOption) do
      primary_key id : Int64
      add_timestamps

      add option_text : String
      add_belongs_to poll : Poll, on_delete: :cascade
    end

    create table_for(PollVote) do
      primary_key id : Int64
      add_timestamps

      add_belongs_to poll : Poll, on_delete: :cascade
      add_belongs_to poll_option : PollOption, on_delete: :cascade
      add_belongs_to user : User, on_delete: :cascade
    end

    # Ensure one vote per user per poll
    execute "CREATE UNIQUE INDEX poll_votes_user_poll_index ON poll_votes (user_id, poll_id);"
  end

  def rollback
    drop table_for(PollVote)
    drop table_for(PollOption)
    drop table_for(Poll)
  end
end
