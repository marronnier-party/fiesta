require "../../wizard/summary"

class Locations::Wizard::Summary < Shared::Wizard::Summary
  needs location : Location
  needs parent_event : Event?

  private def render_content
    div class: "p-4 space-y-4" do
      render_step_summary "Nom", location.name, 1, "home"
      render_address_summary
      render_step_summary "Description", location.description, 3, "file-text"
    end
  end

  private def render_address_summary
    return unless location.address.presence

    div class: summary_item_class(2) do
      div class: "flex items-center gap-2" do
        mount UI::Icon, "map-pin", class: "w-4 h-4"
        span "Adresse", class: "font-medium"
      end

      para class: "text-sm mt-1" do
        text location.address
        br
        text "#{location.postal_code} #{location.city}"
      end

      render_edit_link(2) if current_step > 2
    end
  end

  private def render_edit_link(step : Int32)
    link "Modifier",
      to: Locations::Wizard::GoToStep.with(
        location_id: location.id,
        current_step: step
      ),
      class: "text-xs text-primary hover:underline mt-2 block",
      hx_get: Locations::Wizard::GoToStep.with(
        location_id: location.id,
        current_step: step
      ).path,
      hx_target: "#location-wizard-content"
  end

  private def show_summary? : Bool
    !location.name.nil? || !location.address.nil? || !location.description.nil?
  end
end
