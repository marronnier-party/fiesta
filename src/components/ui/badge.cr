class UI::Badge < BaseComponent
  needs text : String
  needs variant : String = "ghost" # ghost, primary, secondary, success, warning, error, info
  needs size : String = "md" # sm, md, lg

  def render
    span @text, class: badge_classes
  end

  private def badge_classes
    base = "badge"
    color = "badge-#{@variant}"
    size_class = @size == "sm" ? "badge-sm" : @size == "lg" ? "badge-lg" : ""

    [base, color, size_class].reject(&.empty?).join(" ")
  end
end
