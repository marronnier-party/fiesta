class EventTemplateQuery < EventTemplate::BaseQuery
  def for_user(user : User)
    creator_id(user.id)
  end

  def for_user(user_id : Int64)
    creator_id(user_id)
  end

  def ordered_by_name
    name.asc_order
  end

  def recent
    created_at.desc_order
  end
end
