abstract class Shared::Wizard::Summary < BaseComponent
  needs current_step : Int32 = 1

  def render
    div class: "fixed right-4 top-4 w-80 bg-base-200 rounded-lg shadow-xl transition-transform duration-300 overflow-hidden #{show_summary? ? "" : "translate-x-96"}" do
      render_header
      render_content
    end
  end

  private def render_header
    div class: "p-4 bg-base-300 flex justify-between items-center" do
      h3 "Résumé", class: "font-bold"
      button "×",
             class: "btn btn-ghost btn-sm btn-circle",
             onclick: "this.closest('.fixed').classList.toggle('translate-x-96')"
    end
  end

  protected def render_step_summary(label, value, step, icon)
    return unless value.presence

    div class: summary_item_class(step) do
      div class: "flex items-center gap-2" do
        mount UI::Icon, icon, class: "w-4 h-4"
        span label, class: "font-medium"
      end

      para truncate_text(value.to_s, 50), class: "text-sm mt-1"

      if step < current_step
        render_edit_link(step)
      end
    end
  end

  private def summary_item_class(step)
    base = "p-3 rounded-lg"
    base += " bg-base-100" if step == current_step
    base
  end

  # Abstract methods
  abstract def render_content
  abstract def render_edit_link(step : Int32)
  abstract def show_summary? : Bool
end
