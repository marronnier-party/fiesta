class SecretSantaAssignment < BaseModel
  enum Status
    Pending
    Purchased
    Given
  end

  table do
    column status : SecretSantaAssignment::Status = SecretSantaAssignment::Status::Pending
    column notes : String?

    belongs_to secret_santa : SecretSanta
    belongs_to giver : Guest
    belongs_to receiver : Guest
  end
end
