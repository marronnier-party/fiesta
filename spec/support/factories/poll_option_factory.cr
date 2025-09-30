class PollOptionFactory < Avram::Factory
  def initialize
    option_text "Option 1"
    poll_id PollFactory.create.id
  end
end
