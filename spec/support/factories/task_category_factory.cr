class TaskCategoryFactory < Avram::Factory
  def initialize
    name "Food"
    is_default false
    user_id UserFactory.create.id
  end
end
