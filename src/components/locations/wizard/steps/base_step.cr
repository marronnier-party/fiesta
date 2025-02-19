abstract class Locations::Wizard::Steps::BaseStep < Shared::Wizard::Step
  needs location : Location

  abstract def step_title
  abstract def step_number

  def render
    div class: card_classes, id: "location-step-#{step_number}" do
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

  private def back_path : String
    Locations::New.with(current_step: step_number - 1)
  end

  private def render_next_button
    button step_number == 3 ? "Terminer" : "Suivant",
      class: "btn btn-primary",
      type: "submit"
  end

  private def card_classes
    "card bg-base-100 shadow-sm"
  end
end
