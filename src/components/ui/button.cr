class UI::Button < BaseComponent
  needs text : String
  needs variant : String = "primary" # primary, secondary, ghost, outline, error, success
  needs size : String = "md" # xs, sm, md, lg
  needs icon_name : String? = nil
  needs icon_position : String = "left" # left, right
  needs disabled : Bool = false
  needs type : String = "button"
  needs classes : String = ""

  def render(&)
    button type: type, class: button_classes, disabled: disabled do
      if icon_name && icon_position == "left"
        icon icon_name, icon_size_class + " mr-2"
      end

      self.text text

      if icon_name && icon_position == "right"
        icon icon_name, icon_size_class + " ml-2"
      end

      yield if block_given?
    end
  end

  def render
    render { }
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
