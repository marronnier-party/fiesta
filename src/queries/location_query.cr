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

  def with_coordinates
    where { (latitude.is_not(nil)) & (longitude.is_not(nil)) }
  end
end
