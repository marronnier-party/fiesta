class TaskFactory < Avram::Factory
  def initialize
    name "Task #{sequence("task-name")}"
    status Task::Status::Pending
    position 0
    event_id EventFactory.create.id
  end
end
