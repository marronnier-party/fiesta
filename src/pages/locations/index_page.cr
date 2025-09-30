class Locations::IndexPage < MainLayout
  needs locations : Array(Location)
  needs search_query : String

  def page_title
    r("locations.my_locations").t
  end

  def content
    div class: "container mx-auto px-4 py-8" do
      div class: "flex justify-between items-center mb-8" do
        h1 r("locations.my_locations").t, class: "text-4xl font-bold"
        link r("locations.create").t, to: Locations::New, class: "btn btn-primary"
      end

      # Search box
      unless locations.empty? && search_query.blank?
        render_search_box
      end

      if locations.empty?
        if search_query.blank?
          render_empty_state
        else
          render_no_results
        end
      else
        div class: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" do
          locations.each do |location|
            render_location_card(location)
          end
        end
      end
    end
  end

  private def render_search_box
    form_for Locations::Index, method: "get", class: "mb-6" do
      div class: "form-control" do
        div class: "input-group" do
          input type: "text",
            name: "search",
            value: search_query,
            placeholder: r("locations.search_placeholder").t,
            class: "input input-bordered w-full"
          button type: "submit", class: "btn btn-square" do
            icon "search", "w-5 h-5"
          end
        end
      end
    end
  end

  private def render_no_results
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body text-center py-12" do
        icon "search", "w-16 h-16 mx-auto mb-4 text-base-content/40"
        h2 r("locations.no_results").t, class: "text-2xl font-bold mb-2"
        para r("locations.no_results_hint").t(query: search_query), class: "text-base-content/70 mb-6"
        link r("locations.view_all").t, to: Locations::Index, class: "btn btn-ghost"
      end
    end
  end

  private def render_empty_state
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body text-center py-12" do
        icon "map-pin", "w-16 h-16 mx-auto mb-4 text-base-content/40"
        h2 r("locations.no_locations").t, class: "text-2xl font-bold mb-2"
        para r("locations.no_locations_hint").t, class: "text-base-content/70 mb-6"
        link r("locations.create").t, to: Locations::New, class: "btn btn-primary"
      end
    end
  end

  private def render_location_card(location : Location)
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 location.name, class: "card-title"

        if desc = location.description
          para desc, class: "text-base-content/70 text-sm mb-2"
        end

        if address = location.address
          div class: "flex items-start gap-2 text-sm text-base-content/60" do
            icon "map-pin", "w-4 h-4 mt-0.5"
            div do
              div address
              if city = location.city
                text city
                if postal_code = location.postal_code
                  text " #{postal_code}"
                end
              end
            end
          end
        end

        div class: "card-actions justify-end mt-4" do
          link r("actions.edit").t, to: Locations::Edit.with(location.id), class: "btn btn-sm btn-ghost"
          form_for Locations::Delete.with(location.id), class: "inline" do
            button type: "submit", class: "btn btn-sm btn-ghost btn-square", data_confirm: r("actions.confirm_delete").t do
              icon "trash", "w-4 h-4"
            end
          end
        end
      end
    end
  end
end
