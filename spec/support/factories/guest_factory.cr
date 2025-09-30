class GuestFactory < Avram::Factory
  def initialize
    status Guest::Status::NoAnswer
    guest_count 1
    user_id UserFactory.create.id
    event_id EventFactory.create.id
  end
end
