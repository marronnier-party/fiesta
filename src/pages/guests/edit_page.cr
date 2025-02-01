class Guests::EditPage < MainLayout
  needs operation : SaveGuest
  needs guest : Guest
  quick_def page_title, "Edit Guest with id: #{guest.id}"

  def content
    link "Back to all Guests", to: Guests::Index
    h1 "Edit Guest with id: #{guest.id}"
    render_guest_form(operation)
  end

  def render_guest_form(op)
    form_for Guests::Update.with(guest.id) do
      # Edit fields in src/components/guests/form_fields.cr
      mount Guests::FormFields, op

      submit "Update", data_disable_with: "Updating..."
    end
  end
end
