# Complete Events::Wizard::Steps::Location component
class Events::Wizard::Steps::Location < Events::Wizard::Steps::BaseStep
  def step_title
    "On se retrouve où ? 📍"
  end

  def step_number
    3
  end

  def render_content
    div class: "space-y-6" do
      render_location_options
      render_selected_content
    end
  end

  private def render_location_options
    div class: "flex flex-col sm:flex-row gap-4 justify-center" do
      render_option_button("Choisir un lieu existant", "map-pin", "existing")
      render_option_button("Créer un nouveau lieu", "plus-circle", "new")
      render_option_button("Je définirai le lieu plus tard", "clock", "skip")
    end
  end

  private def render_option_button(text, icon, option)
    button text,
      class: location_button_class(option),
      hx_get: Events::LocationOption.with(
        event_id: event.id,
        option: option
      ).path,
      hx_target: "#location-content" do
      mount UI::Icon, icon, class: "w-5 h-5"
      span text
    end
  end

  private def render_selected_content
    div id: "location-content", class: "mt-8" do
      case params.get?("option")
      when "existing"
        render_existing_locations
      when "new"
        render_new_location_wizard
      when "skip"
        render_skip_confirmation
      end
    end
  end

  private def render_existing_locations
    div class: "space-y-4" do
      # Search input for locations
      div class: "form-control" do
        input type: "text",
          placeholder: "Rechercher un lieu...",
          class: "input input-bordered w-full",
          hx_get: Locations::Search.path,
          hx_trigger: "keyup changed delay:500ms",
          hx_target: "#location-results"
      end

      # Location results
      div id: "location-results", class: "space-y-2" do
        LocationQuery.new.creator_id(current_user.id).each do |location|
          render_location_card(location)
        end
      end
    end
  end

  private def render_location_card(location)
    div class: "card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
      hx_post: Events::SetLocation.with(event_id: event.id, location_id: location.id).path,
      hx_target: "#location-content" do
      div class: "card-body" do
        div class: "flex justify-between items-start" do
          div do
            h3 location.name, class: "font-bold"
            para "#{location.address}, #{location.city}"
          end
          if location.try(&.id) == @location.try(&.id)
            div class: "badge badge-primary" do
              span "Sélectionné"
            end
          end
        end
      end
    end
  end

  private def render_new_location_wizard
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        mount Locations::Wizard::CreationContainer,
          current_step: 1,
          location: Location.new,
          parent_event: event
      end
    end
  end

  private def render_skip_confirmation
    div class: "text-center space-y-4" do
      para "Tu pourras définir le lieu plus tard depuis la page de l'événement.",
        class: "text-base-content"

      button "Confirmer et continuer",
        class: "btn btn-primary",
        hx_post: Events::SkipLocation.with(event_id: event.id).path,
        hx_target: "#wizard-content"
    end
  end

  private def location_button_class(option)
    base = "btn gap-2"
    if params.get?("option") == option
      base += " btn-primary"
    else
      base += " btn-outline"
    end
    base
  end
end
