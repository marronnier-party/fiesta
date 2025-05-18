# class Locations::NewPage < MainLayout
#   needs operation : SaveLocation
#   quick_def page_title, "New Location"

#   def content
#     h1 "New Location"
#     render_location_form(operation)
#   end

#   def render_location_form(op)
#     form_for Locations::Create do
#       # Edit fields in src/components/locations/form_fields.cr
#       mount Locations::FormFields, op

#       submit "Save", data_disable_with: "Saving..."
#     end
#   end
# end
