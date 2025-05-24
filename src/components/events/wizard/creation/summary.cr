# src/components/events/wizard/creation/summary.cr
class Events::Wizard::Creation::Summary < Shared::Wizard::Summary
  needs event : Event
  needs location : Location?

  # needs current_step : Int32 # Ensure current_step is accessible (e.g., via 'needs' or a getter from the parent class)

  private def render_content
    div class: "p-4 space-y-4" do
      render_step_summary "Nom", event.name, 1, "pencil"
      render_date_summary
      render_location_summary
      render_step_summary "Description", event.description.to_s, 4, "file-text"
      render_guests_summary
    end
  end

  private def render_date_summary
    return unless event.start_at && event.end_at

    start_time = event.start_at.not_nil!
    end_time = event.end_at.not_nil!

    div class: summary_item_class(2) do # summary_item_class must be defined in this class or a parent
      div class: "flex items-center gap-2" do
        mount UI::Icon, "calendar", class: "w-4 h-4"
        span "Date", class: "font-medium"
      end

      para class: "text-sm mt-1" do
        text start_time.to_s("%d/%m/%Y")
        br
        text "#{start_time.to_s("%H:%M")} - #{end_time.to_s("%H:%M")}"
      end

      # current_step must be accessible here
      render_edit_link(2) if current_step > 2
    end
  end

  private def render_location_summary
    return unless location

    current_location = location.not_nil!

    div class: summary_item_class(3) do
      div class: "flex items-center gap-2" do
        mount UI::Icon, "map-pin", class: "w-4 h-4"
        span "Lieu", class: "font-medium"
      end

      para class: "text-sm mt-1" do
        text current_location.name
        br
        text current_location.city.to_s
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
        text "#{event.guests.size} personne#{event.guests.size == 1 ? "" : "s"} invitée#{event.guests.size == 1 ? "" : "s"}"
      end

      render_edit_link(5)
    end
  end

  # CORRECTION: Renommer 'step_to_edit' en 'step' pour correspondre à la méthode parente
  private def render_edit_link(step : Int32)
    return
    # # 1. Create the RouteHelper object by calling .with on the Action class
    # # This encapsulates the action and its parameters needed for URL generation.
    # route_helper_object = Events::Wizard::Creation::GoToStep.with(
    #   event_id: event.id,
    #   current_step: step # Utiliser 'step' ici aussi
    # )

    # # 2. For hx_get, we need the string path from the RouteHelper object.
    # path_for_htmx = route_helper_object.path

    # # 3. Pass the RouteHelper object to the 'to:' argument of the link.
    # #    Other arguments become HTML attributes.
    # link "Modifier",
    #   to: route_helper_object,
    #   # HTML attributes (including HTMX attributes)
    #   class: "text-xs text-primary hover:underline mt-2 block",
    #   hx_get: path_for_htmx,
    #   hx_target: "#wizard-content",
    #   hx_swap: "innerHTML"
  end

  private def show_summary? : Bool
    !event.name.blank?
  end

  # Example: You need to ensure 'current_step' and 'summary_item_class' are available.
  # If not inherited or defined in Shared::Wizard::Summary, you might need:
  #
  # getter current_step : Int32 do
  #   # Logic to get current_step, e.g., from context.params or a passed 'needs'
  #   # This is a placeholder, adapt to your actual way of getting current_step
  #   @current_step || context.params.get("current_step").as(Int32)? || 1
  # end
  #
  # private def summary_item_class(step_number : Int32) : String
  #   # Example implementation
  #   is_active = step_number == current_step
  #   is_done = step_number < current_step
  #   classes = "summary-item p-3 border-b border-base-300"
  #   classes += " summary-item-active bg-primary-focus" if is_active
  #   classes += " summary-item-done opacity-75" if is_done && !is_active
  #   classes
  # end
end
