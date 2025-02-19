abstract class Shared::Wizard::Preview < Shared::Wizard::Step
  def render_content
    div class: "space-y-8" do
      render_preview_sections
      render_completion_button
    end
  end

  private def render_preview_sections
    div class: "grid grid-cols-1 md:grid-cols-2 gap-6" do
      render_left_column
      render_right_column
    end
  end

  private def render_completion_button
    div class: "text-center" do
      link "Ça me va !",
           to: completion_path,
           class: "btn btn-primary btn-lg gap-2" do
        mount UI::Icon, "check", class: "w-5 h-5"
        text "Ça me va !"
      end
    end
  end

  # Helper method for consistent section styling
  protected def render_section(title : String, icon : String, &)
    div class: "space-y-2" do
      div class: "flex items-center gap-2 text-lg font-semibold" do
        mount UI::Icon, icon, class: "w-5 h-5"
        text title
      end

      div class: "pl-7 space-y-1 text-base-content/80" do
        yield
      end
    end
  end

  # Abstract methods
  abstract def render_left_column
  abstract def render_right_column
  abstract def completion_path : String
end
