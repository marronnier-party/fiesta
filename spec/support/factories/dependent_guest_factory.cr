class DependentGuestFactory < Avram::Factory
  def initialize
    guest_id GuestFactory.create.id
    name "Plus One"
  end
end
