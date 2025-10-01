class SecretSantaAssignmentFactory < Avram::Factory
  def initialize
    status SecretSantaAssignment::Status::Pending
  end
end
