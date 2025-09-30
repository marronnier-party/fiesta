class PollFactory < Avram::Factory
  def initialize
    question "What time works best?"
    is_locked false
    event_id EventFactory.create.id
  end
end
