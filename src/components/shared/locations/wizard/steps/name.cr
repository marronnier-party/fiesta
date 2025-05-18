class Locations::Wizard::Steps::Name < Locations::Wizard::Steps::BaseStep
  def step_title
    "Comment s'appelle ce lieu ? 🏡"
  end

  def step_number
    1
  end

  def render_content
    name_value = location ? location.not_nil!.name : ""
    action = location ? Locations::Wizard::UpdateName.with(location_id: location.not_nil!.id) : Locations::Wizard::NameAndCreate
    form_for action, # .with(parent_event_id: ***),
      class: "space-y-4",
      hx_post: action.path,                  # Chemin pour HTMX POST
      hx_target: "#location-wizard-content", # ID de la cible à mettre à jour
      hx_swap: "innerHTML" do                # Comment remplacer le contenu de la cible
      div class: "form-control" do
        input type: "text",
          name: "location:name",
          value: name_value,
          placeholder: "Ex: Maison de Roger",
          class: "input input-bordered w-full",
          required: true,
          minlength: "3",
          maxlength: "100"
      end
      render_next_button
    end
  end
end
