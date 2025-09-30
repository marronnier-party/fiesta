class SecretSantaAssignmentQuery < SecretSantaAssignment::BaseQuery
  def for_secret_santa(secret_santa : SecretSanta)
    secret_santa_id(secret_santa.id)
  end

  def for_giver(guest : Guest)
    giver_id(guest.id)
  end

  def for_receiver(guest : Guest)
    receiver_id(guest.id)
  end
end
