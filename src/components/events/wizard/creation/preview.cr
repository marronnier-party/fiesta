class Events::Wizard::Creation::Steps::Preview < Shared::Wizard::Preview
  needs event : Event
  needs location : ::Location?

  def step_title : String
    "Prévisualisation de l'événement 👀"
  end

  def step_number : Int32
    6
  end

  def render_left_column
    render_section("Date et heure", "calendar") do
      if event.start_at && event.end_at
      para do
        text event.start_at.not_nil!.to_s("%d/%m/%Y")
        br
        text "#{event.start_at.not_nil!.to_s("%H:%M")} - #{event.end_at.not_nil!.to_s("%H:%M")}"
      end
    else
      para "Dates à définir", class: "italic text-base-content/60"
    end
    end
    render_section("Lieu", "map-pin") do
      if location
        para location.not_nil!.name, class: "font-medium"
        para "#{location.not_nil!.address.to_s}, #{location.not_nil!.city.to_s}"
      else
        para "À définir", class: "italic text-base-content/60"
      end
    end
  end

  def render_right_column
    render_section("Description", "file-text") do
      if event.description
        para event.description.to_s
      else
        para "Aucune description", class: "italic text-base-content/60"
      end
    end

    render_section("Invités", "users") do
      para "#{event.guests.size} personne#{event.guests.size > 1 ? "s" : ""} invitée#{event.guests.size > 1 ? "s" : ""}"
    end
  end

  def completion_path : String
    Events::Wizard::Creation::Done.with(event_id: event.id).path
  end

  def back_path
    Events::Wizard::Creation::GoToStep.with(event_id: event.id, current_step: 5)
  end

  def is_last_step? : Bool
    true
  end
end
