class Location < BaseModel
  table do
    column name : String
    column slug : String
    column description : String = ""
    column address : String
    column city : String
    column country : String
    column postal_code : String
    column latitude : Float64?
    column longitude : Float64?
    # column is_private : Bool = true
    belongs_to creator : User
    has_many events : Event
  end
end
