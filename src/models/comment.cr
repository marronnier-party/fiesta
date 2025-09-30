class Comment < BaseModel
  table do
    column content : String
    column commentable_type : String
    column commentable_id : Int64

    belongs_to user : User
  end

  def commentable
    case commentable_type
    when "Task"
      TaskQuery.find(commentable_id)
    when "Event"
      EventQuery.find(commentable_id)
    else
      nil
    end
  end
end
