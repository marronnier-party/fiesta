class EventMessage < BaseModel
  table do
    column content : String

    belongs_to event : Event
    belongs_to user : User
  end
end
