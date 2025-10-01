class UI::InfoRow < BaseComponent
  needs icon_name : String
  needs text : String
  needs label : String? = nil
  needs icon_color : String = "text-primary"
  needs size : String = "md" # sm, md, lg

  def render
    div class: "flex items-center gap-#{gap_size}" do
      icon icon_name, "#{icon_size_class} #{icon_color}"

      if label_text = label
        div do
          self.label label_text, class: "font-semibold block"
          span class: "text-base-content/80" do
            self.text text
          end
        end
      else
        self.text text
      end
    end
  end

  private def gap_size
    size == "lg" ? "3" : "2"
  end

  private def icon_size_class
    case size
    when "sm"
      "w-4 h-4"
    when "lg"
      "w-6 h-6"
    else
      "w-5 h-5"
    end
  end
end
