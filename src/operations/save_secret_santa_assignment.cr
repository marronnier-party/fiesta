class SaveSecretSantaAssignment < SecretSantaAssignment::SaveOperation
  permit_columns :secret_santa_id, :giver_id, :receiver_id, :status, :notes

  before_save do
    validate_required secret_santa_id, giver_id, receiver_id
  end
end
