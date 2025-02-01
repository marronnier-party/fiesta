class Location < BaseModel
  table do
    column name : String
    column slug : String
    column description : String
    has_many events : Event
  end
end
