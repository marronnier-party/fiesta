class UserFactory < Avram::Factory
  def initialize
    name "Test User #{sequence("user-name")}"
    email "#{sequence("test-email")}@example.com"
    encrypted_password Authentic.generate_encrypted_password("password")
  end
end
