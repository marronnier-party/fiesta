class EventActivity < BaseModel
  table do
    column activity_type : String
    column description : String

    belongs_to event : Event
    belongs_to user : User
  end
end
