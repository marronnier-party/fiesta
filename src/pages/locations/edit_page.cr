class Locations::EditPage < MainLayout
  needs operation : SaveLocation
  needs location : Location
  quick_def page_title, "Edit Location with id: #{location.id}"

  def content
    link "Back to all Locations", to: Locations::Index
    h1 "Edit Location with id: #{location.id}"
    render_location_form(operation)
  end

  def render_location_form(op)
    form_for Locations::Update.with(location.id) do
      # Edit fields in src/components/locations/form_fields.cr
      mount Locations::FormFields, op

      submit "Update", data_disable_with: "Updating..."
    end
  end
end
