abstract class Shared::Wizard::Base < BaseComponent
  needs current_step : Int32 = 1

  def render
    div class: "min-h-screen bg-base-100" do
      render_summary
      div class: "max-w-2xl mx-auto px-4 py-8" do
        render_progress_bar
        render_current_step
      end
    end
  end

  private def render_progress_bar
    div class: "w-full mb-8" do
      ul class: "steps w-full" do
        steps.each_with_index do |step, index|
          render_step_indicator(step.title, index+1)
        end
      end
    end
  end

  private def render_step_indicator(label, step_number)
    li label,
       class: step_class(step_number),
       hx_get: go_to_step_path(step_number),
       hx_target: wizard_content_id,
       hx_trigger: "click"
  end

  private def step_class(step_number)
    base = "step cursor-pointer"
    base += " step-primary" if current_step >= step_number
    base
  end

  # Abstract methods to be implemented by subclasses
  abstract def steps # : Array(Step) # Returns the steps configuration
  abstract def render_summary
  abstract def render_current_step
  abstract def go_to_step_path(step_number : Int32) : String
  abstract def wizard_content_id : String
end
