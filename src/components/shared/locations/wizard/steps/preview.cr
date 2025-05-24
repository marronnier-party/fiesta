require "../../../wizard/preview"

class Locations::Wizard::Steps::Preview < Shared::Wizard::Preview
  needs location : Location

  def step_title : String
    "Prévisualisation du lieu 👀"
  end

  def step_number : Int32
    4
  end

  def render_left_column
    render_section("Nom et adresse", "map-pin") do
      para location.name, class: "font-medium"
      para location.address.to_s
      para "#{location.postal_code.to_s} #{location.city.to_s}"
      para location.country.to_s
    end
  end

  def render_right_column
    render_section("Coordonnées", "globe") do
      if location.latitude && location.longitude
        para "Latitude: #{location.latitude}"
        para "Longitude: #{location.longitude}"
      else
        para "Coordonnées non définies", class: "italic text-base-content/60"
      end
    end

    render_section("Description", "file-text") do
      if location.description
        para location.description.to_s
      else
        para "Aucune description", class: "italic text-base-content/60"
      end
    end
  end

  def completion_path : String
    Locations::Wizard::Done.with(location_id: location.id).path
  end

  def back_path
    Locations::Wizard::GoToStep.with(location_id: location.id, current_step: 3)
  end

  def is_last_step? : Bool
    true
  end
end
