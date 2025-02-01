class Guests::NewPage < MainLayout
  needs operation : SaveGuest
  quick_def page_title, "New Guest"

  def content
    h1 "New Guest"
    render_guest_form(operation)
  end

  def render_guest_form(op)
    form_for Guests::Create do
      # Edit fields in src/components/guests/form_fields.cr
      mount Guests::FormFields, op

      submit "Save", data_disable_with: "Saving..."
    end
  end
end
