class Events::NewPage < MainLayout
  needs save_operation : SaveEvent

  def page_title
    "Create Event"
  end

  def content
    div class: "max-w-3xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 "Create New Event", class: "card-title text-3xl mb-6"

          form_for Events::Create, class: "space-y-6" do
            # Event name
            div class: "form-control" do
              label "Event Name", class: "label font-semibold"
              input type: "text", name: "event:name", value: save_operation.name.value.to_s, placeholder: "Summer 2025 Family Reunion", class: "input input-bordered w-full", required: true
            end

            # Description
            div class: "form-control" do
              label "Description", class: "label font-semibold"
              tag "textarea", name: "event:description", class: "textarea textarea-bordered h-32", placeholder: "Tell everyone what to expect..." do
                text save_operation.description.value || ""
              end
            end

            # Date and time
            div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
              div class: "form-control" do
                label "Start Date & Time", class: "label font-semibold"
                input type: "datetime-local", name: "event:start_at", value: format_datetime_input(save_operation.start_at.value), class: "input input-bordered w-full"
              end

              div class: "form-control" do
                label "End Date & Time", class: "label font-semibold"
                input type: "datetime-local", name: "event:end_at", value: format_datetime_input(save_operation.end_at.value), class: "input input-bordered w-full"
              end
            end

            # Location selection
            div class: "form-control" do
              label "Location", class: "label font-semibold"
              tag "select", name: "event:location_id", class: "select select-bordered w-full" do
                tag "option", value: "" do
                  text "Select a location..."
                end

                LocationQuery.new.alphabetical.results.each do |location|
                  tag "option", value: location.id.to_s, selected: (save_operation.location_id.value == location.id) do
                    text location.name
                  end
                end
              end
              label class: "label" do
                span class: "label-text-alt" do
                  text "Or "
                  link "create a new location", to: Locations::New, class: "link link-primary"
                end
              end
            end

            # Actions
            div class: "card-actions justify-end mt-8" do
              link "Cancel", to: Events::Index, class: "btn btn-ghost"
              button "Save as Draft", name: "event:status", value: Event::Status::Draft.value, class: "btn btn-outline"
              button "Publish Event", name: "event:status", value: Event::Status::Confirmed.value, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end

  private def format_datetime_input(time : Time?) : String
    return "" unless time
    time.to_s("%Y-%m-%dT%H:%M")
  end
end
