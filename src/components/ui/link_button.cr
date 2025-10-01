class UI::LinkButton < BaseComponent
  needs text : String
  needs to : Lucky::Action.class | String
  needs variant : String = "primary"
  needs size : String = "md"
  needs icon_name : String? = nil
  needs icon_position : String = "left"
  needs classes : String = ""

  def render
    link to: to, class: button_classes do
      if icon_name && icon_position == "left"
        icon icon_name, icon_size_class + " mr-2"
      end

      self.text text

      if icon_name && icon_position == "right"
        icon icon_name, icon_size_class + " ml-2"
      end
    end
  end

  private def button_classes
    base = "btn"
    variant_class = "btn-#{variant}" unless variant == "default"
    size_class = "btn-#{size}" unless size == "md"

    [base, variant_class, size_class, classes].compact.reject(&.empty?).join(" ")
  end

  private def icon_size_class
    case size
    when "xs"
      "w-3 h-3"
    when "sm"
      "w-4 h-4"
    when "lg"
      "w-6 h-6"
    else
      "w-5 h-5"
    end
  end
end
