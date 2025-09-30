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
            div class: "form-control" do
              label r("locations.name").t, class: "label font-semibold"
              input type: "text", name: "location:name", value: save_operation.name.value.to_s, placeholder: r("locations.placeholder.name").t, class: "input input-bordered w-full", required: true
            end

            # Address
            div class: "form-control" do
              label r("locations.address").t, class: "label font-semibold"
              input type: "text", name: "location:address", value: save_operation.address.value.to_s, placeholder: r("locations.placeholder.address").t, class: "input input-bordered w-full"
            end

            # City and Postal Code
            div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
              div class: "form-control" do
                label r("locations.city").t, class: "label font-semibold"
                input type: "text", name: "location:city", value: save_operation.city.value.to_s, placeholder: r("locations.placeholder.city").t, class: "input input-bordered w-full"
              end

              div class: "form-control" do
                label r("locations.postal_code").t, class: "label font-semibold"
                input type: "text", name: "location:postal_code", value: save_operation.postal_code.value.to_s, placeholder: r("locations.placeholder.postal_code").t, class: "input input-bordered w-full"
              end
            end

            # Country
            div class: "form-control" do
              label r("locations.country").t, class: "label font-semibold"
              input type: "text", name: "location:country", value: (save_operation.country.value || "France").to_s, placeholder: r("locations.placeholder.country").t, class: "input input-bordered w-full"
            end

            # Description
            div class: "form-control" do
              label r("guests.notes_optional").t, class: "label font-semibold"
              tag "textarea", name: "location:description", class: "textarea textarea-bordered h-24", placeholder: r("locations.placeholder.description").t do
                text save_operation.description.value || ""
              end
            end

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
