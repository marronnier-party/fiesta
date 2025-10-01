class UI::PageHeader < BaseComponent
  needs title : String
  needs title_size : String = "3xl" # 2xl, 3xl, 4xl
  needs action_text : String? = nil
  needs action_path : (Lucky::Action.class)? = nil
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

      if action_text && action_path
        link to: action_path, class: "btn btn-primary" do
          if action_icon
            icon action_icon, "w-5 h-5 mr-2"
          end
          text action_text
        end
      end

      yield if block_given?
    end
  end

  def render
    render { }
  end
end
