class LocationQuery < Location::BaseQuery
  def for_user(user : User)
    creator_id(user.id)
  end

  def recent
    order_by(:created_at, :desc)
  end

  def alphabetical
    order_by(:name, :asc)
  end
end
