class Locations::Wizard::Steps::Details < Locations::Wizard::Steps::BaseStep
  def step_title
    "Quelques détails supplémentaires ? 📝"
  end

  def step_number
    3
  end

  def render_content
    form_for Locations::Create, # .with(current_step: step_number),
      class: "space-y-4" do
      div class: "grid grid-cols-2 gap-4" do
        div class: "form-control" do
          label "Ville", class: "label"
          input type: "text",
            name: "location:city",
            value: location.not_nil!.city,
            class: "input input-bordered w-full",
            required: true
        end

        div class: "form-control" do
          label "Code postal", class: "label"
          input type: "text",
            name: "location:postal_code",
            value: location.not_nil!.postal_code,
            class: "input input-bordered w-full",
            required: true,
            pattern: "\\d{5}",
            title: "Code postal à 5 chiffres"
        end
      end

      div class: "form-control" do
        label "Pays", class: "label"
        input type: "text",
          name: "location:country",
          value: location.not_nil!.country || "France",
          class: "input input-bordered w-full",
          required: true
      end
    end
  end
end
