class EventTemplate < BaseModel
  table do
    column name : String
    column description : String?
    column task_templates : String? = "[]"
    column default_guest_ids : String? = "[]"

    belongs_to location : Location?
    belongs_to creator : User
  end

  def task_list : Array(Hash(String, String))
    templates = task_templates
    return [] of Hash(String, String) if templates.nil?
    Array(Hash(String, String)).from_json(templates)
  rescue JSON::ParseException
    [] of Hash(String, String)
  end

  def guest_ids : Array(Int64)
    ids = default_guest_ids
    return [] of Int64 if ids.nil?
    Array(Int64).from_json(ids)
  rescue JSON::ParseException
    [] of Int64
  end
end
