class DependentGuest < BaseModel
  table do
    column name : String
    column age : Int32?
    column relationship : String?
    column dietary_restrictions : String?

    belongs_to guest : Guest
  end
end
