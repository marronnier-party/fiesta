class Events::Wizard::Summary < Shared::Wizard::Summary
  needs event : Event
  needs location : Location?

  private def render_content
    div class: "p-4 space-y-4" do
      render_step_summary "Nom", event.name, 1, "pencil"
      render_date_summary
      render_location_summary
      render_step_summary "Description", event.description, 4, "file-text"
      render_guests_summary
    end
  end

  private def render_date_summary
    return unless event.start_at && event.end_at

    div class: summary_item_class(2) do
      div class: "flex items-center gap-2" do
        mount UI::Icon, "calendar", class: "w-4 h-4"
        span "Date", class: "font-medium"
      end

      para class: "text-sm mt-1" do
        text event.start_at.to_s("%d/%m/%Y")
        br
        text "#{event.start_at.to_s("%H:%M")} - #{event.end_at.to_s("%H:%M")}"
      end

      render_edit_link(2) if current_step > 2
    end
  end

  private def render_location_summary
    return unless location

    div class: summary_item_class(3) do
      div class: "flex items-center gap-2" do
        mount UI::Icon, "map-pin", class: "w-4 h-4"
        span "Lieu", class: "font-medium"
      end

      para class: "text-sm mt-1" do
        text location.name
        br
        text location.city
      end

      render_edit_link(3) if current_step > 3
    end
  end

  private def render_guests_summary
    return unless current_step >= 5

    div class: summary_item_class(5) do
      div class: "flex items-center gap-2" do
        mount UI::Icon, "users", class: "w-4 h-4"
        span "Invités", class: "font-medium"
      end

      para class: "text-sm mt-1" do
        text "#{event.guests.size} personnes invitées"
      end

      render_edit_link(5) if current_step > 5
    end
  end

  private def render_edit_link(step : Int32)
    link "Modifier",
         to: Events::Wizard::GoToStep.with(
           event_id: event.id,
           current_step: step
         ),
         class: "text-xs text-primary hover:underline mt-2 block",
         hx_get: Events::Wizard::GoToStep.with(
           event_id: event.id,
           current_step: step
         ).path,
         hx_target: "#wizard-content"
  end

  private def show_summary? : Bool
    event.name ||
      event.start_at ||
      location ||
      event.description.presence ||
      !event.guests.empty?
  end
end
