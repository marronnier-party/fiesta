class Events::Wizard::Creation::Steps::Description < Events::Wizard::Creation::Steps::BaseStep
  def step_title : String
    "Un petit mot pour décrire l'événement ? ✍️"
  end

  def step_number
    4
  end

  def render_content
    form_for Events::Wizard::Creation::UpdateDescription.with(event_id: event.not_nil!.id),
      class: "space-y-4" do
      div class: "form-control" do
        textarea name: "event:description",
          value: event.not_nil!.description,
          placeholder: "Ex: On va fêter les 80 ans de Mamie ! Venez nombreux !",
          class: "textarea textarea-bordered h-32"
      end
    end
  end
end
