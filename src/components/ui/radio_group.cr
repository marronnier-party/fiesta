class UI::RadioGroup < BaseComponent
  record Option,
    value : String,
    label : String,
    subtitle : String? = nil,
    color : String = "primary"

  needs label_text : String
  needs name : String
  needs options : Array(Option)
  needs selected_value : String? = nil
  needs layout : String = "vertical" # vertical, horizontal

  def render
    div class: "form-control" do
      label label_text, class: "label font-semibold"

      div class: layout_class do
        options.each do |option|
          render_option(option)
        end
      end
    end
  end

  private def layout_class
    layout == "horizontal" ? "flex flex-row gap-3" : "flex flex-col gap-3"
  end

  private def render_option(option)
    is_selected = option.value == selected_value
    border_color = "hover:border-#{option.color}"

    label class: "label cursor-pointer justify-start gap-4 border-2 border-base-300 rounded-lg p-4 #{border_color}" do
      input type: "radio", name: name, value: option.value,
        class: "radio radio-#{option.color}", checked: is_selected
      div do
        span option.label, class: "font-semibold"
        if subtitle = option.subtitle
          br
          span subtitle, class: "text-sm text-base-content/60"
        end
      end
    end
  end
end
