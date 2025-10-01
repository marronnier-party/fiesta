class Locations::EditPage < MainLayout
  needs operation : SaveLocation
  needs location : Location
  quick_def page_title, "Edit Location with id: #{location.id}"

  def content
    div class: "max-w-2xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("locations.edit").t, class: "card-title text-3xl mb-6"

          form_for Locations::Update.with(location.id), class: "space-y-6" do
            mount UI::FormInput,
              label_text: r("locations.name").t,
              name: "location:name",
              value: operation.name.value.to_s,
              placeholder: r("locations.placeholder.name").t,
              required: true

            mount UI::FormInput,
              label_text: r("locations.address").t,
              name: "location:address",
              value: operation.address.value.to_s,
              placeholder: r("locations.placeholder.address").t

            div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
              mount UI::FormInput,
                label_text: r("locations.city").t,
                name: "location:city",
                value: operation.city.value.to_s,
                placeholder: r("locations.placeholder.city").t

              mount UI::FormInput,
                label_text: r("locations.postal_code").t,
                name: "location:postal_code",
                value: operation.postal_code.value.to_s,
                placeholder: r("locations.placeholder.postal_code").t
            end

            mount UI::FormInput,
              label_text: r("locations.country").t,
              name: "location:country",
              value: (operation.country.value || "France").to_s,
              placeholder: r("locations.placeholder.country").t

            mount UI::FormTextarea,
              label_text: r("guests.notes_optional").t,
              name: "location:description",
              value: operation.description.value,
              placeholder: r("locations.placeholder.description").t,
              rows: 3

            div class: "card-actions justify-end mt-8" do
              link r("actions.cancel").t, to: Locations::Index, class: "btn btn-ghost"
              button r("actions.save").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
