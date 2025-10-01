class Locations::ShowPage < MainLayout
  needs location : Location

  def page_title
    location.name
  end

  def content
    div class: "max-w-4xl mx-auto space-y-6" do
      mount UI::PageHeader,
        title: location.name,
        action_text: r("actions.edit").t,
        action_path: Locations::Edit.with(location.id)

      # Map display (if coordinates available)
      if location.latitude && location.longitude
        div class: "card bg-base-100 shadow-xl" do
          div class: "card-body" do
            h2 "Map", class: "card-title text-2xl mb-4"
            mount UI::Map,
              latitude: location.latitude,
              longitude: location.longitude,
              zoom: 15,
              height: "400px",
              editable: false
          end
        end
      end

      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h2 r("locations.details").t, class: "card-title text-2xl mb-4"

          div class: "space-y-4" do
            if address = location.address
              mount UI::InfoRow,
                icon_name: "map-pin",
                label: r("locations.address").t,
                text: address,
                size: "lg"
            end

            if city = location.city
              mount UI::InfoRow,
                icon_name: "building",
                label: r("locations.city").t,
                text: city,
                size: "lg"
            end

            if postal_code = location.postal_code
              mount UI::InfoRow,
                icon_name: "mail",
                label: r("locations.postal_code").t,
                text: postal_code,
                size: "lg"
            end

            if country = location.country
              mount UI::InfoRow,
                icon_name: "globe",
                label: r("locations.country").t,
                text: country,
                size: "lg"
            end

            if description = location.description
              div do
                label r("locations.description").t, class: "font-semibold"
                para description, class: "text-base-content/80 mt-1"
              end
            end
          end

          div class: "card-actions justify-end mt-6 gap-2" do
            link r("actions.back").t, to: Locations::Index, class: "btn btn-ghost"
            form_for Locations::Delete.with(location.id), class: "inline" do
              button r("actions.delete").t, type: "submit", class: "btn btn-error btn-outline", data_confirm: r("actions.confirm_delete").t
            end
          end
        end
      end
    end
  end
end
