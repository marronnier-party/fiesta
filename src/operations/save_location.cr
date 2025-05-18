class SaveLocation < Location::SaveOperation
  permit_columns name, description, address, city, postal_code, country, latitude, longitude, creator_id

  before_save do
    validate_required name

    Avram::Slugify.set slug,
      using: name,
      query: LocationQuery.new
    # validate_required address
    # validate_required city
    # validate_required postal_code
    # validate_required country
    # validate_coordinates
  end

  private def validate_coordinates
    return unless latitude.value || longitude.value
    if latitude.value.nil? && longitude.value
      latitude.add_error "requis si la longitude est définie"
    elsif longitude.value.nil? && latitude.value
      longitude.add_error "requis si la latitude est définie"
    end
  end
end
