class UpdateUserProfile < User::SaveOperation
  param_key :user

  permit_columns name, email
  attribute password : String
  attribute password_confirmation : String
  attribute current_password : String

  before_save do
    validate_uniqueness_of email

    # Only update password if new password is provided
    if password.value && !password.value.to_s.empty?
      # Validate current password
      if current_password.value.nil? || current_password.value.to_s.empty?
        current_password.add_error("errors.required")
      elsif user = record
        if !Authentic.correct_password?(user, current_password.value.to_s)
          current_password.add_error("errors.invalid")
        else
          # Password confirmation validation
          if password_confirmation.value != password.value
            password_confirmation.add_error("errors.passwords_must_match")
          else
            # Encrypt and save new password using the attribute, not the value
            Authentic.copy_and_encrypt(password, to: encrypted_password)
          end
        end
      end
    end
  end
end
