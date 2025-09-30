class Locations::NewPage < MainLayout
  needs save_operation : SaveLocation

  def page_title
    "Create Location"
  end

  def content
    div class: "max-w-2xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 "Create New Location", class: "card-title text-3xl mb-6"

          form_for Locations::Create, class: "space-y-6" do
            # Location name
            div class: "form-control" do
              label "Location Name", class: "label font-semibold"
              input type: "text", name: "location:name", value: save_operation.name.value.to_s, placeholder: "Grandma's House", class: "input input-bordered w-full", required: true
            end

            # Address
            div class: "form-control" do
              label "Street Address", class: "label font-semibold"
              input type: "text", name: "location:address", value: save_operation.address.value.to_s, placeholder: "123 Main Street", class: "input input-bordered w-full"
            end

            # City and Postal Code
            div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
              div class: "form-control" do
                label "City", class: "label font-semibold"
                input type: "text", name: "location:city", value: save_operation.city.value.to_s, placeholder: "Lyon", class: "input input-bordered w-full"
              end

              div class: "form-control" do
                label "Postal Code", class: "label font-semibold"
                input type: "text", name: "location:postal_code", value: save_operation.postal_code.value.to_s, placeholder: "69001", class: "input input-bordered w-full"
              end
            end

            # Country
            div class: "form-control" do
              label "Country", class: "label font-semibold"
              input type: "text", name: "location:country", value: (save_operation.country.value || "France").to_s, placeholder: "France", class: "input input-bordered w-full"
            end

            # Description
            div class: "form-control" do
              label "Description (optional)", class: "label font-semibold"
              tag "textarea", name: "location:description", class: "textarea textarea-bordered h-24", placeholder: "Any helpful details about this location..." do
                text save_operation.description.value || ""
              end
            end

            # Actions
            div class: "card-actions justify-end mt-8" do
              link "Cancel", to: Events::New, class: "btn btn-ghost"
              button "Save Location", class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
