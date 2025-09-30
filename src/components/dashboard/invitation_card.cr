class Dashboard::InvitationCard < BaseComponent
  needs guest : Guest

  def render
    div class: "card bg-base-100 shadow-xl border-2 border-warning" do
      div class: "card-body" do
        div class: "flex items-start justify-between mb-4" do
          div class: "flex-1" do
            h3 guest.event!.name, class: "card-title text-2xl"
            para class: "text-sm text-base-content/70 mt-1" do
              text r("events.organized_by").t(name: guest.event!.creator!.name)
            end
          end

          span class: "badge badge-warning badge-lg gap-2" do
            mount UI::Icon, name: "alert-triangle", classes: "w-4 h-4"
            text r("guests.rsvp_now").t
          end
        end

        render_event_details

        div class: "card-actions justify-end mt-4" do
          link r("events.view_details").t, to: Events::Show.with(guest.event_id), class: "btn btn-ghost"
          link r("guests.rsvp_now").t, to: Guests::Rsvp.with(guest.id), class: "btn btn-primary"
        end
      end
    end
  end

  private def render_event_details
    div class: "space-y-2" do
      if start_at = guest.event!.start_at
        div class: "flex items-center gap-2 text-base-content/80" do
          mount UI::Icon, name: "calendar", classes: "w-5 h-5"
          text format_date(start_at)
        end
      end

      if location = guest.event!.location
        div class: "flex items-center gap-2 text-base-content/80" do
          mount UI::Icon, name: "map-pin", classes: "w-5 h-5"
          text location.name
        end
      end

      if description = guest.event!.description
        para class: "text-base-content/70 mt-2 line-clamp-2" do
          text description
        end
      end
    end
  end

  private def format_date(time : Time)
    time.to_s("%B %-d, %Y at %-I:%M %p")
  end
end
