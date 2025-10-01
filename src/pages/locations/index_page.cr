class Locations::IndexPage < MainLayout
  needs locations : Array(Location)
  needs search_query : String

  def page_title
    r("locations.my_locations").t
  end

  def content
    div class: "container mx-auto px-4 py-8" do
      mount UI::PageHeader,
        title: r("locations.my_locations").t,
        title_size: "4xl",
        action_text: r("locations.create").t,
        action_path: Locations::New.route

      # Search box
      unless locations.empty? && search_query.blank?
        mount UI::SearchBox,
          action: Locations::Index,
          query: search_query,
          placeholder: r("locations.search_placeholder").t,
          max_width: "2xl"
      end

      if locations.empty?
        if search_query.blank?
          mount UI::EmptyState,
            title: r("locations.no_locations").t,
            description: r("locations.no_locations_hint").t,
            icon_name: "map-pin",
            action_text: r("locations.create").t,
            action_path: Locations::New.route
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
