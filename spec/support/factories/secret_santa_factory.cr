class SecretSantaFactory < Avram::Factory
  def initialize
    gift_budget 50.0
    rules "Maximum $50 per gift. Handmade gifts are encouraged!"
    assignments_locked false
    event_id EventFactory.create.id
  end
end
