class PollVoteFactory < Avram::Factory
  def initialize
    poll = PollFactory.create
    option = PollOptionFactory.create &.poll_id(poll.id)
    poll_id poll.id
    poll_option_id option.id
    user_id UserFactory.create.id
  end
end
