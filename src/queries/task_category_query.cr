class TaskCategoryQuery < TaskCategory::BaseQuery
  def for_user(user : User)
    user_id(user.id)
  end

  def for_user(user_id : Int64)
    user_id(user_id)
  end

  def ordered_by_name
    name.asc_order
  end

  def default_categories
    is_default(true)
  end

  def custom_categories
    is_default(false)
  end
end
