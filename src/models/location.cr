class Location < BaseModel
  table do
    column name : String
    column slug : String
    column description : String = "fezfsdf"
    column address : String = "fezfsdf"
    column city : String = "fezfsdf"
    column country : String = "fezfsdf"
    column postal_code : String = "fezfsdf"
    column latitude : Float64?
    column longitude : Float64?
    # column is_private : Bool = true
    belongs_to creator : User
    has_many events : Event
  end
end
