class Guests::GuestRow < BaseComponent
  needs guest : Guest
  needs current_user : User
  needs is_organizer : Bool
  needs event : Event

  def render
    div id: "guest-#{guest.id}",
        class: "flex items-center justify-between p-3 bg-base-200 rounded-lg" do

      div class: "flex items-center gap-3" do
        mount UI::Avatar, user: guest.user!, size: "md"

        div do
          div guest.user!.name, class: "font-semibold"
          if guest.guest_count > 1
            small "(+#{guest.guest_count - 1})", class: "text-sm text-base-content/60"
          end
        end
      end

      # Status controls with htmx
      div class: "flex items-center gap-2" do
        mount UI::StatusBadge, status: guest.status

        if is_organizer
          render_status_controls
        end

        # Show attendance marking for organizers on past events
        render_attendance_controls if show_attendance_controls?
      end
    end
  end

  private def render_status_controls
    div class: "dropdown dropdown-end", "x-data": "dropdown" do
      button class: "btn btn-sm btn-ghost", "@click": "toggle()" do
        icon "edit", "w-4 h-4"
      end

      div class: "dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10",
           "x-show": "open",
           "@click.away": "close()",
           style: "display: none;" do

        Guest::Status.values.each do |status|
          button status.to_s, **attrs(
            class: "btn btn-sm btn-ghost justify-start",
            hx_put: Guests::UpdateStatus.with(guest.id).path,
            hx_vals: {"status" => status.to_s}.to_json,
            hx_target: "#guest-#{guest.id}",
            hx_swap: "outerHTML"
          )
        end
      end
    end
  end

  private def show_attendance_controls?
    is_organizer && event.start_at && event.start_at.not_nil! < Time.utc
  end

  private def render_attendance_controls
    if guest.status == Guest::Status::Confirmed
      form_for Guests::MarkAttended.with(guest.id), class: "inline" do
        button r("guests.mark_attended").t, type: "submit", class: "btn btn-xs btn-success"
      end
    elsif guest.status == Guest::Status::Attended
      form_for Guests::UnmarkAttended.with(guest.id), class: "inline" do
        button r("guests.unmark_attended").t, type: "submit", class: "btn btn-xs btn-ghost"
      end
    end
  end
end
