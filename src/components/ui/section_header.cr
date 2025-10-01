class UI::SectionHeader < BaseComponent
  needs title : String
  needs icon_name : String? = nil
  needs icon_color : String = "text-primary"
  needs size : String = "2xl"

  def render(&)
    div class: "flex items-center justify-between mb-4" do
      div class: "flex items-center gap-2" do
        if icon_value = @icon_name
          icon icon_value, "w-6 h-6 #{@icon_color}"
        end
        h2 @title, class: "text-#{@size} font-semibold"
      end

      yield
    end
  end

  def render
    render { }
  end
end
