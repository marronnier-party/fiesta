abstract class Events::Wizard::Creation::Steps::BaseStep < BaseComponent
  needs event : Event?

  abstract def step_title
  abstract def step_number

  def render
    render_persistence_script
    div class: card_classes, id: "step-#{step_number}" do
      div class: "card-body" do
        h2 step_title, class: "card-title mb-6 text-2xl"
        render_content
        render_navigation
      end
    end
  end

  abstract def render_content

  private def render_navigation
    div class: "card-actions justify-between mt-6" do
      render_back_button unless step_number == 1
      render_next_button
    end
  end

  private def render_back_button
    link "Retour",
      to: Events::Wizard::Creation::GoToStep.with(current_step: step_number - 1, event_id: event.not_nil!.id),
      class: "btn btn-ghost"
  end

  private def render_next_button
    button next_button_text,
      class: "btn btn-primary",
      type: "submit"
  end

  private def next_button_text
    step_number == 5 ? "Terminer" : "Suivant"
  end

  private def card_classes
    "card bg-base-200 shadow-xl"
  end

  def render_persistence_script
    # script src: asset("js/wizard-persistence.js")
  end
end
