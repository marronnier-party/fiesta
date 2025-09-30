class CreateComments::V20250930183000 < Avram::Migrator::Migration::V1
  def migrate
    create table_for(Comment) do
      primary_key id : Int64
      add_timestamps
      add_belongs_to user : User, on_delete: :cascade
      add content : String
      add commentable_type : String
      add commentable_id : Int64
    end

    create_index table_for(Comment), [:commentable_type, :commentable_id], name: :comments_on_commentable_index
  end

  def rollback
    drop table_for(Comment)
  end
end
