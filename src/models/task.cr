class Task < BaseModel
  table do
    column name : String
    belongs_to event : Event
    belongs_to guest : Guest?
  end
end
