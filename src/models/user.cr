class User < BaseModel
  include Carbon::Emailable
  include Authentic::PasswordAuthenticatable

  table do
    column email : String
    column encrypted_password : String
    column name : String = "choucroute"
    column avatar_url : String?

    has_many invitations : Guest # foreign_key: :guest_id
    has_many events : Event, through: [:invitations, :event]
  end

  def emailable : Carbon::Address
    Carbon::Address.new(email)
  end
end
