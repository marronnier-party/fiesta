require "../../wizard/base"

class Locations::Wizard::Container < Shared::Wizard::Base
  needs location : Location? = nil
  needs parent_event : Event? = nil

  private def render_summary
    return if location.nil?
    mount Locations::Wizard::Summary,
      location: location.not_nil!,
      current_step: current_step,
      parent_event: parent_event
  end

  private def render_step_indicator(label, step_number)
    return if location.nil?
    li label,
       class: step_class(step_number),
       hx_get: Locations::Wizard::GoToStep.with(
         location_id: location.not_nil!.id,
         current_step: step_number
       ).path,
       hx_target: "#location-wizard-content",
       hx_trigger: "click"
  end

  private def steps #: Array(Shared::Wizard::Step)
  [
    Locations::Wizard::Steps::Name,
    Locations::Wizard::Steps::Address,
    Locations::Wizard::Steps::Details,
    # Locations::Wizard::Steps::Preview,
    ]
  end

  private def render_current_step
    div id: "location-wizard-content", class: "transition-all duration-300" do
      # mount Locations::Wizard::Steps::Preview, location: location.not_nil!
      mount steps[current_step - 1], location: location.not_nil!
    end
  end

  private def go_to_step_path(step_number : Int32) : String
    Locations::Wizard::GoToStep.with(
            location_id: location.not_nil!.id,
            current_step: step_number
          ).path
  end

  private def wizard_content_id : String
    "location-wizard-content"
  end
end
