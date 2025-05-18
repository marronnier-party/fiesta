require "./step.cr"

abstract class Shared::Wizard::Form < Shared::Wizard::Step
  def render_content
    form_for form_action, class: "space-y-4" do
      render_form_fields
    end
  end

  # Abstract methods
  abstract def form_action
  abstract def render_form_fields
end
