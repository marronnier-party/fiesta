class Events::WizardStep < BaseComponent
  needs step_number : Int32
  needs current_step : Int32
  needs title : String
  needs form_id : String

  def render(&)
    div class: card_classes, id: "step-#{step_number}", data_step: step_number do
      div class: "card-body" do
        h2 title, class: "card-title mb-6 text-2xl"

        form id: form_id,
          class: "space-y-6",
          hx_post: "/events/validate_step",
          hx_trigger: "change, input delay:500ms",
          hx_swap: "outerHTML",
          hx_target: "##{form_id}-errors" do
          div id: "#{form_id}-errors", class: "space-y-2"
          yield

          navigation_buttons
        end
      end
    end
  end

  private def card_classes
    base = "card bg-base-200 shadow-xl transition-all duration-300"
    base += " opacity-0 translate-x-full" if step_number != current_step
    base += " opacity-100" if step_number == current_step
    base
  end

  private def navigation_buttons
    div class: "card-actions justify-between mt-6" do
      back_button unless step_number == 1
      next_button
    end
  end

  private def back_button
    button "Retour",
      class: "btn btn-ghost",
      hx_get: Events::New.path(current_step: step_number - 1),
      hx_target: "#wizard-content",
      hx_swap: "innerHTML transition:slide-right"
  end

  private def next_button
    button step_number == 4 ? "Prévisualiser" : "Suivant",
      class: "btn btn-primary",
      type: "submit",
      hx_post: Events::Create.path(current_step: step_number),
      hx_target: "#wizard-content",
      hx_swap: "innerHTML transition:slide-left"
  end
end
