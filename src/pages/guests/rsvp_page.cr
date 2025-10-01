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
            mount UI::InfoRow,
              icon_name: "calendar",
              text: format_datetime_with_day(start_at)
          end

          if location = guest.event!.location
            mount UI::InfoRow,
              icon_name: "map-pin",
              text: location.name
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
          mount UI::RadioGroup,
            label_text: r("guests.will_attend").t,
            name: "guest:status",
            selected_value: guest.status.value.to_s,
            options: [
              UI::RadioGroup::Option.new(
                value: Guest::Status::Confirmed.value.to_s,
                label: r("guests.yes_coming").t,
                subtitle: r("guests.yes_coming_subtitle").t,
                color: "primary"
              ),
              UI::RadioGroup::Option.new(
                value: Guest::Status::Declined.value.to_s,
                label: r("guests.no_sorry").t,
                subtitle: r("guests.no_sorry_subtitle").t,
                color: "error"
              )
            ]

          # Guest Count (only show if attending)
          mount UI::FormInput,
            label_text: r("guests.how_many").t,
            name: "guest:guest_count",
            value: guest.guest_count.to_s,
            input_type: "number",
            hint: r("guests.how_many_hint").t

          # Notes
          mount UI::FormTextarea,
            label_text: r("guests.notes_optional").t,
            name: "guest:notes",
            value: guest.notes,
            placeholder: r("guests.notes_placeholder").t,
            rows: 3

          # Submit buttons
          div class: "card-actions justify-end mt-6" do
            link r("actions.cancel").t, to: Me::Show, class: "btn btn-ghost"
            button r("guests.save_rsvp").t, class: "btn btn-primary btn-lg"
          end
        end
      end
    end
  end

end
