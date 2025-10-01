class Locations::NewPage < MainLayout
  needs save_operation : SaveLocation

  def page_title
    r("locations.create").t
  end

  def content
    div class: "max-w-2xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("locations.new").t, class: "card-title text-3xl mb-6"

          form_for Locations::Create, class: "space-y-6" do
            # Location name
            mount UI::FormInput,
              label_text: r("locations.name").t,
              name: "location:name",
              value: save_operation.name.value.to_s,
              placeholder: r("locations.placeholder.name").t,
              required: true

            # Address with autocomplete
            mount UI::AddressAutocomplete,
              label_text: r("locations.address").t,
              name: "location:address",
              value: save_operation.address.value.to_s,
              placeholder: r("locations.placeholder.address").t,
              help_text: "Start typing to search for an address",
              address_name: "location:address",
              city_name: "location:city",
              postal_code_name: "location:postal_code",
              country_name: "location:country",
              latitude_name: "location:latitude",
              longitude_name: "location:longitude"

            # City and Postal Code (auto-filled from autocomplete)
            div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
              mount UI::FormInput,
                label_text: r("locations.city").t,
                name: "location:city",
                value: save_operation.city.value.to_s,
                placeholder: r("locations.placeholder.city").t

              mount UI::FormInput,
                label_text: r("locations.postal_code").t,
                name: "location:postal_code",
                value: save_operation.postal_code.value.to_s,
                placeholder: r("locations.placeholder.postal_code").t
            end

            # Country (auto-filled from autocomplete)
            mount UI::FormInput,
              label_text: r("locations.country").t,
              name: "location:country",
              value: (save_operation.country.value || "France").to_s,
              placeholder: r("locations.placeholder.country").t

            # Description
            mount UI::FormTextarea,
              label_text: r("guests.notes_optional").t,
              name: "location:description",
              value: save_operation.description.value,
              placeholder: r("locations.placeholder.description").t,
              rows: 3

            # Map preview
            div class: "divider" do
              text "Map Preview"
            end
            mount UI::Map,
              latitude: save_operation.latitude.value,
              longitude: save_operation.longitude.value,
              zoom: 13,
              height: "300px",
              editable: true,
              latitude_input_name: "location:latitude",
              longitude_input_name: "location:longitude"

            # Actions
            div class: "card-actions justify-end mt-8" do
              link r("actions.cancel").t, to: Events::New, class: "btn btn-ghost"
              button r("actions.save").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
