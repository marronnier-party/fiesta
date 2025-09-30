class SaveLocation < Location::SaveOperation
  permit_columns name, description, address, city, postal_code, country, latitude, longitude, creator_id

  before_save do
    validate_required name
    validate_coordinates

    Avram::Slugify.set slug,
      using: name,
      query: LocationQuery.new.creator_id(creator_id.value || 0)
  end

  private def validate_coordinates
    return unless latitude.value || longitude.value

    if latitude.value.nil? && longitude.value
      latitude.add_error "is required if longitude is provided"
    elsif longitude.value.nil? && latitude.value
      longitude.add_error "is required if latitude is provided"
    end
  end
end
