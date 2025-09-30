class DependentGuests::ManagePage < MainLayout
  needs guest : Guest
  needs dependent_guests : Array(DependentGuest)
  needs save_operation : SaveDependentGuest = SaveDependentGuest.new

  def page_title
    r("dependent_guests.manage").t
  end

  def content
    div class: "max-w-4xl mx-auto px-4 py-8" do
      div class: "mb-6" do
        link r("actions.back").t + " " + r("guests.rsvp").t.downcase, to: Guests::Rsvp.with(guest.id), class: "btn btn-ghost btn-sm"
      end

      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("dependent_guests.manage").t, class: "card-title text-3xl mb-2"
          para r("dependent_guests.manage_subtitle").t(event: guest.event!.name), class: "text-gray-600 mb-6"

          # Existing dependent guests
          if dependent_guests.any?
            div class: "mb-8" do
              h2 r("dependent_guests.your_plus_ones").t, class: "text-xl font-semibold mb-4"
              div class: "space-y-3" do
                dependent_guests.each do |dep_guest|
                  div class: "card bg-base-200" do
                    div class: "card-body p-4" do
                      div class: "flex justify-between items-start" do
                        div do
                          h3 dep_guest.name, class: "font-semibold text-lg"
                          if dep_guest.age
                            para r("dependent_guests.age").t + ": #{dep_guest.age}", class: "text-sm text-gray-600"
                          end
                          if dep_guest.relationship
                            para r("dependent_guests.relationship").t + ": #{dep_guest.relationship}", class: "text-sm text-gray-600"
                          end
                          if dep_guest.dietary_restrictions
                            para r("dependent_guests.dietary").t + ": #{dep_guest.dietary_restrictions}", class: "text-sm text-gray-600"
                          end
                        end
                        link r("actions.delete").t,
                          to: DependentGuests::Delete.with(guest.id, dep_guest.id),
                          data_confirm: r("actions.confirm_delete").t,
                          "data-method": "delete",
                          class: "btn btn-ghost btn-sm text-error"
                      end
                    end
                  end
                end
              end
            end
          else
            div class: "alert alert-info mb-8" do
              icon "info-circle", "w-5 h-5"
              span r("dependent_guests.no_plus_ones").t
            end
          end

          # Add new dependent guest form
          div class: "divider" do
            text r("dependent_guests.add_new").t
          end

          form_for DependentGuests::Create.with(guest.id), class: "space-y-4" do
            div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
              # Name
              div class: "form-control" do
                label r("dependent_guests.name").t + " *", class: "label font-semibold"
                input type: "text",
                  name: "dependent_guest:name",
                  value: save_operation.name.value.to_s,
                  placeholder: r("dependent_guests.name_placeholder").t,
                  class: "input input-bordered",
                  required: true
              end

              # Age
              div class: "form-control" do
                label r("dependent_guests.age").t + " (" + r("guests.notes_optional").t.downcase + ")", class: "label font-semibold"
                input type: "number",
                  name: "dependent_guest:age",
                  value: save_operation.age.value.to_s,
                  placeholder: "25",
                  min: "0",
                  max: "150",
                  class: "input input-bordered"
              end
            end

            div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
              # Relationship
              div class: "form-control" do
                label r("dependent_guests.relationship").t + " (" + r("guests.notes_optional").t.downcase + ")", class: "label font-semibold"
                input type: "text",
                  name: "dependent_guest:relationship",
                  value: save_operation.relationship.value.to_s,
                  placeholder: r("dependent_guests.relationship_placeholder").t,
                  class: "input input-bordered"
              end

              # Dietary restrictions
              div class: "form-control" do
                label r("dependent_guests.dietary").t + " (" + r("guests.notes_optional").t.downcase + ")", class: "label font-semibold"
                input type: "text",
                  name: "dependent_guest:dietary_restrictions",
                  value: save_operation.dietary_restrictions.value.to_s,
                  placeholder: r("dependent_guests.dietary_placeholder").t,
                  class: "input input-bordered"
              end
            end

            div class: "card-actions justify-end mt-6" do
              button r("dependent_guests.add_plus_one").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
