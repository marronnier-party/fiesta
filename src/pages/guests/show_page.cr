class Guests::ShowPage < MainLayout
  needs guest : Guest
  quick_def page_title, "Guest with id: #{guest.id}"

  def content
    link "Back to all Guests", to: Guests::Index
    h1 "Guest with id: #{guest.id}"
    render_actions
    render_guest_fields
  end

  def render_actions
    section do
      link "Edit", to: Guests::Edit.with(guest.id)
      text " | "
      link "Delete",
        to: Guests::Delete.with(guest.id),
        data_confirm: "Are you sure?"
    end
  end

  def render_guest_fields
    ul do
      li do
        text "uselesscolumn: "
        strong "guest.uselesscolumn.to_s"
      end
    end
  end
end
