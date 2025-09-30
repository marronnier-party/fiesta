class SecretSanta < BaseModel
  table do
    column gift_budget : Float64?
    column rules : String?
    column assignments_locked : Bool = false
    column reveal_date : Time?

    belongs_to event : Event
  end
end
