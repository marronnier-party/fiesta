class SecretSantaAssignmentFactory < Avram::Factory
  def initialize
    status SecretSantaAssignment::Status::Pending
    secret_santa_id SecretSantaFactory.create.id

    # Create guests for giver and receiver
    event = SecretSanta.find(secret_santa_id)
    giver_user = UserFactory.create
    receiver_user = UserFactory.create

    giver_guest = GuestFactory.create &.event_id(event.event_id).user_id(giver_user.id)
    receiver_guest = GuestFactory.create &.event_id(event.event_id).user_id(receiver_user.id)

    giver_id giver_guest.id
    receiver_id receiver_guest.id
  end
end
