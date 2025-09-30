class CommentQuery < Comment::BaseQuery
  def for_commentable(type : String, id : Int64)
    commentable_type(type).commentable_id(id)
  end

  def for_task(task : Task)
    for_commentable("Task", task.id)
  end

  def for_event(event : Event)
    for_commentable("Event", event.id)
  end

  def recent
    order_by(:created_at, :asc)
  end
end
