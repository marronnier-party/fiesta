class UI::PageHeader < BaseComponent
  needs title : String
  needs title_size : String = "3xl" # 2xl, 3xl, 4xl
  needs action_text : String? = nil
  needs action_path : Lucky::RouteHelper? = nil
  needs action_icon : String? = nil
  needs subtitle : String? = nil

  def render(&)
    div class: "flex items-center justify-between mb-6" do
      div class: "flex-1" do
        h1 title, class: "text-#{title_size} font-bold"
        if sub = subtitle
          para sub, class: "text-base-content/70 mt-2"
        end
      end

      if (action_text_value = action_text) && (path = action_path)
        link to: path, class: "btn btn-primary" do
          if icon_value = action_icon
            icon icon_value, "w-5 h-5 mr-2"
          end
          text action_text_value
        end
      end

      yield
    end
  end

  def render
    render { }
  end
end
