class Events::NewPage < MainLayout
  needs current_step : Int32 = 1
  needs event : Event
  needs location : Location?

  def page_title
    "Créer un événement familial"
  end

  def content
    div class: "min-h-screen bg-base-100" do
      div class: "max-w-2xl mx-auto px-4 py-8" do
        progress_bar
        current_step_content
      end
    end
  end

  private def progress_bar
    div class: "w-full mb-8" do
      ul class: "steps w-full" do
        li "Nom", class: step_class(1)
        li "Date & Heure", class: step_class(2)
        li "Lieu", class: step_class(3)
        li "Description", class: step_class(4)
      end
    end
  end

  private def step_class(step_number)
    base_class = "step"
    base_class += " step-primary" if current_step >= step_number
    base_class
  end

  private def current_step_content
    case current_step
    when 1
      render_step_1
    when 2
      render_step_2
    when 3
      render_step_3
    when 4
      render_step_4
    end
  end

  private def render_step_1
    div class: "card bg-base-200 shadow-xl" do
      div class: "card-body" do
        h2 "Comment on appelle ton événement ? 🎉", class: "card-title mb-6 text-2xl"
        form_for Events::Create.with(current_step: 1) do
          div class: "form-control" do
            input type: "text",
              name: "event:name",
              value: event.name,
              placeholder: "Ex: Anniversaire de Mamie",
              class: "input input-bordered w-full"
          end
          div class: "card-actions justify-end mt-6" do
            submit "Suivant", class: "btn btn-primary"
          end
        end
      end
    end
  end

  private def render_step_2
    div class: "card bg-base-200 shadow-xl" do
      div class: "card-body" do
        h2 "C'est pour quand ? 📅", class: "card-title mb-6 text-2xl"
        form_for Events::Create.with(current_step: 2, event_id: event.id) do
          div class: "form-control space-y-4" do
            div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
              div do
                label "Début", class: "label"
                input type: "datetime-local",
                  name: "event:start_at",
                  value: event.start_at.to_s("%Y-%m-%dT%H:%M"),
                  class: "input input-bordered w-full"
              end
              div do
                label "Fin", class: "label"
                input type: "datetime-local",
                  name: "event:end_at",
                  value: event.end_at.to_s("%Y-%m-%dT%H:%M"),
                  class: "input input-bordered w-full"
              end
            end
          end
          div class: "card-actions justify-between mt-6" do
            link "Retour", to: Events::New.with(current_step: 1), class: "btn btn-ghost"
            submit "Suivant", class: "btn btn-primary"
          end
        end
      end
    end
  end

  private def render_step_3
    div class: "card bg-base-200 shadow-xl" do
      div class: "card-body" do
        h2 "On se retrouve où ? 📍", class: "card-title mb-6 text-2xl"
        form_for Events::Create.with(current_step: 3, event_id: event.id) do
          div class: "form-control space-y-4" do
            div do
              label "Nom du lieu", class: "label"
              input type: "text",
                name: "location:name",
                value: location.try(&.name),
                placeholder: "Ex: Maison de Mamie",
                class: "input input-bordered w-full"
            end
            div do
              label "Adresse", class: "label"
              input type: "text",
                name: "location:address",
                value: location.try(&.address),
                placeholder: "Ex: 123 rue des Lilas",
                class: "input input-bordered w-full",
                "data-address-autocomplete": "true"
            end
            div class: "grid grid-cols-2 gap-4" do
              div do
                label "Ville", class: "label"
                input type: "text",
                  name: "location:city",
                  value: location.try(&.city),
                  class: "input input-bordered w-full"
              end
              div do
                label "Code postal", class: "label"
                input type: "text",
                  name: "location:postal_code",
                  value: location.try(&.postal_code),
                  class: "input input-bordered w-full"
              end
            end
            div do
              label "Pays", class: "label"
              input type: "text",
                name: "location:country",
                value: location.try(&.country) || "France",
                class: "input input-bordered w-full"
            end
          end
          div class: "card-actions justify-between mt-6" do
            link "Retour", to: Events::New.with(current_step: 2), class: "btn btn-ghost"
            submit "Suivant", class: "btn btn-primary"
          end
        end
      end
    end
  end

  private def render_step_4
    div class: "card bg-base-200 shadow-xl" do
      div class: "card-body" do
        h2 "Un petit mot pour décrire l'événement ? ✍️", class: "card-title mb-6 text-2xl"
        form_for Events::Create.with(current_step: 4, event_id: event.id) do
          div class: "form-control" do
            textarea name: "event:description",
              placeholder: "Ex: On va fêter les 80 ans de Mamie ! Venez nombreux !",
              class: "textarea textarea-bordered h-32"
          end
          div class: "card-actions justify-between mt-6" do
            link "Retour", to: Events::New.with(current_step: 3), class: "btn btn-ghost"
            submit "Terminer", class: "btn btn-primary"
          end
        end
      end
    end
  end
end
