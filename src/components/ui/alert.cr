class UI::Alert < BaseComponent
  needs message : String
  needs type : String = "info" # info, success, warning, error
  needs icon_name : String? = nil
  needs dismissible : Bool = false
  needs size : String = "md" # sm, md

  def render
    div class: alert_classes do
      if icon = icon_name
        self.icon icon, icon_size
      end
      span message, class: text_class

      if dismissible
        button class: "btn btn-sm btn-ghost" do
          self.icon "x", "w-4 h-4"
        end
      end
    end
  end

  private def alert_classes
    classes = ["alert", "alert-#{type}"]
    classes << "py-2" if size == "sm"
    classes.join(" ")
  end

  private def text_class
    size == "sm" ? "text-sm" : ""
  end

  private def icon_size
    size == "sm" ? "w-4 h-4" : "w-5 h-5"
  end
end
