require "./base_step"

class Locations::Wizard::Steps::Address < Locations::Wizard::Steps::BaseStep
  def step_title
    "Quelle est l'adresse ? 📍"
  end

  def step_number
    2
  end

  def render_content
    form_for Locations::Wizard::UpdateAddress.with(location_id: location.id), #.with(current_step: step_number),
      class: "space-y-4" do
      div class: "form-control" do
        input type: "text",
          name: "location:address",
          value: location.address,
          placeholder: "Ex: 123 rue des Lilas",
          class: "input input-bordered w-full",
          "data-address-autocomplete": "true",
          required: true

        # Hidden fields for coordinates
        input type: "hidden", name: "location:latitude"
        input type: "hidden", name: "location:longitude"
      end

      # Map preview
      div id: "location-map", class: "h-64 rounded-lg overflow-hidden mt-4"
    end
  end
end
