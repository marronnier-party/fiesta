class Guests::RsvpPage < MainLayout
  needs guest : Guest
  needs save_operation : SaveGuest?  = nil

  def page_title
    "#{r("guests.rsvp").t} - #{guest.event!.name}"
  end

  def content
    div class: "max-w-2xl mx-auto" do
      render_event_header
      render_rsvp_form
    end
  end

  private def render_event_header
    div class: "card bg-base-100 shadow-xl mb-6" do
      div class: "card-body" do
        h1 guest.event!.name, class: "card-title text-3xl mb-4"

        div class: "space-y-2 text-base-content/80" do
          if start_at = guest.event!.start_at
            div class: "flex items-center gap-2" do
              mount UI::Icon, name: "calendar", classes: "w-5 h-5"
              text format_date(start_at)
            end
          end

          if location = guest.event!.location
            div class: "flex items-center gap-2" do
              mount UI::Icon, name: "map-pin", classes: "w-5 h-5"
              text location.name
            end
          end

          if description = guest.event!.description
            para class: "mt-4 text-base-content/70" do
              text description
            end
          end
        end
      end
    end
  end

  private def render_rsvp_form
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 r("guests.rsvp_title").t, class: "card-title text-2xl mb-4"

        form_for Guests::Rsvp.with(guest.id), class: "space-y-6" do
          # RSVP Status
          div class: "form-control" do
            label r("guests.will_attend").t, class: "label font-semibold"

            div class: "flex flex-col gap-3" do
              label class: "label cursor-pointer justify-start gap-4 border-2 border-base-300 rounded-lg p-4 hover:border-primary" do
                input type: "radio", name: "guest:status", value: Guest::Status::Confirmed.value, class: "radio radio-primary", checked: guest.status.confirmed?
                div do
                  span r("guests.yes_coming").t, class: "font-semibold"
                  br
                  span r("guests.yes_coming_subtitle").t, class: "text-sm text-base-content/60"
                end
              end

              label class: "label cursor-pointer justify-start gap-4 border-2 border-base-300 rounded-lg p-4 hover:border-error" do
                input type: "radio", name: "guest:status", value: Guest::Status::Declined.value, class: "radio radio-error", checked: guest.status.declined?
                div do
                  span r("guests.no_sorry").t, class: "font-semibold"
                  br
                  span r("guests.no_sorry_subtitle").t, class: "text-sm text-base-content/60"
                end
              end
            end
          end

          # Guest Count (only show if attending)
          div class: "form-control", id: "guest-count-section" do
            label r("guests.how_many").t, class: "label font-semibold"
            input type: "number", name: "guest:guest_count", value: guest.guest_count.to_s, min: "1", max: "20", class: "input input-bordered w-full"
            label class: "label" do
              span r("guests.how_many_hint").t, class: "label-text-alt"
            end
          end

          # Notes
          div class: "form-control" do
            label r("guests.notes_optional").t, class: "label font-semibold"
            tag "textarea", name: "guest:notes", class: "textarea textarea-bordered h-24", placeholder: r("guests.notes_placeholder").t do
              text guest.notes || ""
            end
          end

          # Submit buttons
          div class: "card-actions justify-end mt-6" do
            link r("actions.cancel").t, to: Me::Show, class: "btn btn-ghost"
            button r("guests.save_rsvp").t, class: "btn btn-primary btn-lg"
          end
        end
      end
    end
  end

  private def format_date(time : Time)
    time.to_s("%A, %B %-d, %Y at %-I:%M %p")
  end
end
