# src/components/events/wizard/creation/steps/location.cr
class Events::Wizard::Creation::Steps::Location < Events::Wizard::Creation::Steps::BaseStep
  # Assurez-vous que 'event' et 'current_user' sont accessibles ici.
  # Ils pourraient venir de BaseStep, d'un 'getter' dans cette classe,
  # ou être passés lors du 'mount'.
  # Exemple (à adapter si déjà défini ailleurs) :
  # getter event : Event
  # getter current_user : User

  def step_title
    "On se retrouve où ? 📍"
  end

  def step_number
    3 # Numéro de cette étape
  end

  def render_content
    div class: "space-y-6" do
      # Section 1: Conteneur des options initiales
      div id: "location-options-container" do
        render_location_options_buttons
      end

      # Section 2: Conteneur pour afficher les lieux existants (initialement masqué)
      div id: "existing-locations-container", class: "hidden space-y-4" do
        render_existing_locations_content
        render_back_to_options_button
      end

      # Section 3: Conteneur pour le wizard de création de nouveau lieu (initialement masqué)
      div id: "new-location-container", class: "hidden" do
        render_new_location_wizard
        render_back_to_options_button
      end
    end
    render_javascript_for_toggling
  end

  private def render_location_options_buttons
    div class: "flex flex-col sm:flex-row gap-4 justify-center" do
      button_option("Choisir un lieu existant", "map-pin", "showExisting")
      button_option("Créer un nouveau lieu", "plus-circle", "showNew")

      # Bouton pour passer cette étape (via HTMX vers Events::Wizard::Creation::GoToStep)
      # L'étape suivante est la 4.
      next_step_number = 4
      button class: "btn btn-outline btn-primary gap-2",
             hx_get: Events::Wizard::Creation::GoToStep.with(event_id: event.not_nil!.id, current_step: next_step_number).path,
             hx_target: "#wizard-content", # Cible le conteneur principal du wizard
             hx_swap: "innerHTML" do # Assure le remplacement du contenu
        mount UI::Icon, "clock", class: "w-5 h-5"
        span "Je définirai le lieu plus tard"
      end
    end
  end

  private def button_option(text, icon_name, action_key)
    button class: "btn btn-outline btn-primary gap-2", onclick: "handleLocationOption('#{action_key}')" do
      mount UI::Icon, icon_name, class: "w-5 h-5"
      span text
    end
  end

  private def render_back_to_options_button
    button class: "btn btn-sm btn-ghost mt-4", onclick: "showLocationOptions()" do
      mount UI::Icon, "arrow-left", class: "w-4 h-4 mr-2"
      text "Retour aux options"
    end
  end

  private def render_existing_locations_content
    div class: "space-y-4" do
      h4 "Vos lieux enregistrés", class: "text-lg font-semibold text-center mb-4"
      div id: "location-results", class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
        locations = LocationQuery.new
        if locations.empty?
          div class: "col-span-full text-center p-4 border border-dashed rounded-lg" do
            mount UI::Icon, "info", class: "w-10 h-10 mx-auto mb-2 text-gray-400"
            para "Vous n'avez pas encore de lieux enregistrés.", class: "text-gray-600"
            para "Vous pouvez en créer un en cliquant sur \"Créer un nouveau lieu\".", class: "text-sm text-gray-500"
          end
        else
          locations.each do |location|
            render_location_card(location)
          end
        end
      end
    end
  end

  private def render_location_card(location : ::Location)
    button_attrs = {
      class:       "card bg-base-200 shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1 cursor-pointer text-left",
      "hx-post":   Events::Wizard::Creation::UpdateLocation.with(event_id: event.not_nil!.id, location_id: location.id).path,
      "hx-target": "#wizard-content",
      "hx-swap":   "innerHTML",
      "name":      "location_id",
      "value":     location.id.to_s
    }
    button **button_attrs do
      div class: "card-body p-4" do
        h3 location.name, class: "font-semibold text-lg card-title"
        para "#{location.address}, #{location.city}", class: "text-sm opacity-75"
      end
    end
  end

  private def render_new_location_wizard
    mount Locations::Wizard::Container,
      current_step: 1,
      location: nil,
      parent_event_id: event.not_nil!.id
  end

  private def render_javascript_for_toggling
    script type: "text/javascript" do
      raw <<-JS
        function showLocationOptions() {
          document.getElementById('location-options-container').classList.remove('hidden');
          document.getElementById('existing-locations-container').classList.add('hidden');
          document.getElementById('new-location-container').classList.add('hidden');
        }

        function handleLocationOption(option) {
          document.getElementById('location-options-container').classList.add('hidden');
          if (option === 'showExisting') {
            document.getElementById('existing-locations-container').classList.remove('hidden');
            document.getElementById('new-location-container').classList.add('hidden');
          } else if (option === 'showNew') {
            document.getElementById('new-location-container').classList.remove('hidden');
            document.getElementById('existing-locations-container').classList.add('hidden');
          }
        }
      JS
    end
  end
end
