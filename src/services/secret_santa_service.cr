class SecretSantaService
  # Randomize Secret Santa assignments ensuring no one gets themselves
  def self.randomize_assignments(secret_santa : SecretSanta, participants : Array(Guest)) : Bool
    return false if participants.size < 2

    # Delete existing assignments
    SecretSantaAssignmentQuery.new
      .for_secret_santa(secret_santa)
      .delete

    # Create a shuffled list of receivers
    givers = participants.dup
    receivers = participants.dup.shuffle

    # Ensure no one gets themselves
    attempts = 0
    max_attempts = 100

    while attempts < max_attempts
      valid = true
      givers.each_with_index do |giver, idx|
        if giver.id == receivers[idx].id
          valid = false
          break
        end
      end

      break if valid
      receivers.shuffle!
      attempts += 1
    end

    return false if attempts >= max_attempts

    # Create assignments
    givers.each_with_index do |giver, idx|
      SaveSecretSantaAssignment.create!(
        secret_santa_id: secret_santa.id,
        giver_id: giver.id,
        receiver_id: receivers[idx].id,
        status: SecretSantaAssignment::Status::Pending
      )
    end

    true
  rescue
    false
  end
end
