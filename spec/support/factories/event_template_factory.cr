class EventTemplateFactory < Avram::Factory
  def initialize
    name "Summer BBQ Template"
    task_templates "[]"
    default_guest_ids "[]"
    creator_id UserFactory.create.id
  end
end
