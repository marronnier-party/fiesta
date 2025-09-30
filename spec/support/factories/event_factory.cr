class EventFactory < Avram::Factory
  def initialize
    name "Family Gathering #{sequence("event-name")}"
    slug "family-gathering-#{sequence("event-slug")}"
    description "A wonderful family event"
    status Event::Status::Draft
    creator_id UserFactory.create.id
  end
end