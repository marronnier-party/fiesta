class SaveDependentGuest < DependentGuest::SaveOperation
  permit_columns name, age, relationship, dietary_restrictions, guest_id

  before_save do
    validate_required name, guest_id
    validate_age
  end

  private def validate_age
    return unless age.value

    if age.value.not_nil! < 0
      age.add_error "must be 0 or greater"
    elsif age.value.not_nil! > 150
      age.add_error "must be realistic"
    end
  end
end
