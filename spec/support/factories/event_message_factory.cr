class EventMessageFactory < Avram::Factory
  def initialize
    content "This is a test message"
    event_id EventFactory.create.id
    user_id UserFactory.create.id
  end
end
