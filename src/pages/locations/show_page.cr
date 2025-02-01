class Locations::ShowPage < MainLayout
  needs location : Location
  quick_def page_title, "Location with id: #{location.id}"

  def content
    link "Back to all Locations", to: Locations::Index
    h1 "Location with id: #{location.id}"
    render_actions
    render_location_fields
  end

  def render_actions
    section do
      link "Edit", to: Locations::Edit.with(location.id)
      text " | "
      link "Delete",
        to: Locations::Delete.with(location.id),
        data_confirm: "Are you sure?"
    end
  end

  def render_location_fields
    ul do
      li do
        text "name: "
        strong location.name.to_s
      end
      li do
        text "description: "
        strong location.description.to_s
      end
    end
  end
end
