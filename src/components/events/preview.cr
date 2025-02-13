class Events::Preview < BaseComponent
    needs event : Event
    needs location : Location?

    def render
      div class: "space-y-8" do
        render_event_details
        render_location_details if location
        render_privacy_settings
      end
    end

    private def render_event_details
      div class: "card bg-base-200 shadow-xl" do
        div class: "card-body" do
          h3 "Détails de l'événement", class: "card-title"

          div class: "space-y-4 mt-4" do
            detail_row "Nom", event.name
            detail_row "Date", format_date_range(event.start_at, event.end_at)
            detail_row "Description", event.description

            div class: "form-control" do
              label class: "cursor-pointer label" do
                span "Status"
                select name: "event:status",
                      class: "select select-bordered ml-2" do
                  options_for Event::Status
                end
              end
            end
          end
        end
      end
    end

    private def render_location_details
      div class: "card bg-base-200 shadow-xl" do
        div class: "card-body" do
          h3 "Lieu", class: "card-title"

          div class: "space-y-4 mt-4" do
            detail_row "Nom", location.not_nil!.name
            detail_row "Adresse", format_address(location.not_nil!)

            mount Events::LocationMap,
                  latitude: location.not_nil!.latitude,
                  longitude: location.not_nil!.longitude,
                  address: location.not_nil!.address
          end
        end
      end
    end

    private def render_privacy_settings
      div class: "card bg-base-200 shadow-xl" do
        div class: "card-body" do
          h3 "Paramètres de confidentialité", class: "card-title"

          div class: "space-y-4 mt-4" do
            div class: "form-control" do
              label class: "cursor-pointer label" do
                span "Masquer l'adresse exacte aux invités"
                input type: "checkbox",
                      name: "location:is_private",
                      class: "toggle toggle-primary"
              end
            end
          end
        end
      end
    end

    private def detail_row(label, value)
      div class: "flex justify-between" do
        span label, class: "font-medium"
        span value, class: "text-right"
      end
    end

    private def format_date_range(start_at, end_at)
      "#{start_at.to_s("%d/%m/%Y %H:%M")} - #{end_at.to_s("%d/%m/%Y %H:%M")}"
    end

    private def format_address(location)
      [
        location.address,
        location.postal_code,
        location.city,
        location.country
      ].compact.join(", ")
    end
  end
