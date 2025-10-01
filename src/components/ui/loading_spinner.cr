class UI::LoadingSpinner < BaseComponent
  needs size : String = "md" # sm, md, lg
  needs classes : String = ""
  needs show_by_default : Bool = false

  def render
    size_class = case @size
    when "sm"
      "w-4 h-4"
    when "lg"
      "w-12 h-12"
    else
      "w-8 h-8"
    end

    visibility = show_by_default ? "" : "hidden"

    span class: "loading loading-spinner #{size_class} #{@classes} htmx-indicator #{visibility}",
         role: "status",
         "aria-live": "polite",
         "aria-label": "Loading"
  end
end
