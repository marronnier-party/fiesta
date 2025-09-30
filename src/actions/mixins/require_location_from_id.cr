module RequireLocationFromId
  macro included
    before require_location_from_id
  end

  memoize def location? : Location?
    return LocationQuery.new.id(location_id).first
  end

  private def location : Location
    location?.as(Location)
  end

  private def require_location_from_id
    if location
      continue
    else
      plain_text "Location not found"
    end
  end
end
