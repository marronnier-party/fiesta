class Events::Wizard::Creation::Steps::Preview < Shared::Wizard::Preview
  needs event : Event
  needs location : Location?

  def step_title : String
    "Prévisualisation de l'événement 👀"
  end

  def step_number : Int32
    6
  end

  def render_left_column
    render_section("Date et heure", "calendar") do
      para do
        text event.start_at.to_s("%d/%m/%Y")
        br
        text "#{event.start_at.to_s("%H:%M")} - #{event.end_at.to_s("%H:%M")}"
      end
    end

    render_section("Lieu", "map-pin") do
      if location
        para location.name, class: "font-medium"
        para "#{location.address}, #{location.city}"
      else
        para "À définir", class: "italic text-base-content/60"
      end
    end
  end

  def render_right_column
    render_section("Description", "file-text") do
      if event.description.presence
        para event.description
      else
        para "Aucune description", class: "italic text-base-content/60"
      end
    end

    render_section("Invités", "users") do
      para "#{event.guests.size} personne#{event.guests.size > 1 ? "s" : ""} invitée#{event.guests.size > 1 ? "s" : ""}"
    end
  end

  def completion_path : String
    Events::Wizard::Done.with(event_id: event.id).path
  end

  def back_path : String
    Events::Wizard::GoToStep.with(event_id: event.id, current_step: 5).path
  end

  def is_last_step? : Bool
    true
  end
end
