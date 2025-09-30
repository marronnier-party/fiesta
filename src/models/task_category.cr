class TaskCategory < BaseModel
  table do
    column name : String
    column color : String?
    column is_default : Bool = false

    belongs_to user : User
  end
end
