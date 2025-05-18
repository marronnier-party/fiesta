abstract class Shared::Wizard::Step < BaseComponent
  # needs current_step : Int32 = 1

  def render
    render_persistence_script if needs_persistence?
    div class: card_classes, id: "step-#{step_number}" do
      div class: "card-body" do
        h2 step_title, class: "card-title mb-6 text-2xl"
        render_content
        render_navigation
      end
    end
  end

  private def render_navigation
    div class: "card-actions justify-between mt-6" do
      render_back_button unless step_number == 1
      render_next_button
    end
  end

  private def render_back_button
    link "Retour",
         to: back_path,
         class: "btn btn-ghost"
  end

  private def render_next_button
    button next_button_text,
           class: "btn btn-primary",
           type: "submit"
  end

  private def next_button_text
    is_last_step? ? "Terminer" : "Suivant"
  end

  private def card_classes
    "card bg-base-200 shadow-xl"
  end

  private def render_persistence_script
    # script src: asset("js/wizard-persistence.js")
  end

  # Abstract methods
  abstract def render_content
  abstract def back_path

  # To be overridden

  def self.title : String
      "Step title"
  end

  def self.number : Int32
    0
  end

  def is_last_step? : Bool
    false
  end

  # Optional override
  def needs_persistence? : Bool
    false
  end
end
