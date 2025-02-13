class Events::Wizard::Preview < BaseComponent
  needs event : Event
  needs location : Location?

  def render
    div class: "space-y-8" do
      h2 "Prévisualisation de l'événement 👀", class: "text-2xl font-bold text-center mb-8"

      # Event Card Preview
      div class: "card lg:card-side bg-base-200 shadow-xl" do
        div class: "card-body" do
          # Header with title and date
          div class: "space-y-2" do
            h3 event.name, class: "card-title text-2xl"
            render_date_badge
          end

          # Main content
          div class: "divider"></div>

          div class: "grid grid-cols-1 md:grid-cols-2 gap-6" do
            # Left column
            div class: "space-y-4" do
              render_datetime_section
              render_location_section
            end

            # Right column
            div class: "space-y-4" do
              render_description_section
              render_guests_section
            end
          end

          # Action button
          div class: "card-actions justify-center mt-8" do
            link "Ça me va !",
                 to: Events::Wizard::Done.with(event_id: event.id),
                 class: "btn btn-primary btn-lg gap-2" do
              mount UI::Icon, "check", class: "w-5 h-5"
              text "Ça me va !"
            end
          end
        end
      end
    end
  end

  private def render_date_badge
    div class: "badge badge-primary text-sm" do
      text event.start_at.to_s("%d %B %Y")
    end
  end

  private def render_datetime_section
    div class: "space-y-2" do
      div class: "flex items-center gap-2 text-lg font-semibold" do
        mount UI::Icon, "clock", class: "w-5 h-5"
        text "Horaires"
      end

      div class: "pl-7 space-y-1 text-base-content/80" do
        para do
          text "Début : "
          span event.start_at.to_s("%H:%M"), class: "font-medium"
        end
        para do
          text "Fin : "
          span event.end_at.to_s("%H:%M"), class: "font-medium"
        end
      end
    end
  end

  private def render_location_section
    div class: "space-y-2" do
      div class: "flex items-center gap-2 text-lg font-semibold" do
        mount UI::Icon, "map-pin", class: "w-5 h-5"
        text "Lieu"
      end

      if location
        div class: "pl-7 space-y-1 text-base-content/80" do
          para location.name, class: "font-medium"
          para "#{location.address}, #{location.city}"
        end
      else
        div class: "pl-7 italic text-base-content/60" do
          text "À définir"
        end
      end
    end
  end

  private def render_description_section
    div class: "space-y-2" do
      div class: "flex items-center gap-2 text-lg font-semibold" do
        mount UI::Icon, "file-text", class: "w-5 h-5"
        text "Description"
      end

      if event.description.presence
        para event.description, class: "pl-7 text-base-content/80"
      else
        para "Aucune description", class: "pl-7 italic text-base-content/60"
      end
    end
  end

  private def render_guests_section
    div class: "space-y-2" do
      div class: "flex items-center gap-2 text-lg font-semibold" do
        mount UI::Icon, "users", class: "w-5 h-5"
        text "Invités"
      end

      div class: "pl-7" do
        if event.guests.empty?
          para "Aucun invité pour le moment", class: "italic text-base-content/60"
        else
          para "#{event.guests.size} personne#{event.guests.size > 1 ? "s" : ""} invitée#{event.guests.size > 1 ? "s" : ""}"

          # Guest avatars
          div class: "avatar-group -space-x-6 mt-2" do
            event.guests.each do |guest|
              div class: "avatar" do
                div class: "w-12 h-12" do
                  if guest.avatar_url
                    img src: guest.avatar_url, alt: guest.name
                  else
                    div class: "bg-primary text-primary-content rounded-full w-full h-full flex items-center justify-center font-bold" do
                      text guest.name[0].upcase
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
