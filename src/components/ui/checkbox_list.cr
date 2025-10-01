class UI::CheckboxList(T) < BaseComponent
  needs items : Array(T)
  needs name : String
  needs item_value : Proc(T, String)
  needs item_label : Proc(T, String)
  needs item_subtitle : Proc(T, String?)? = nil
  needs show_avatar : Bool = false
  needs max_height : String = "96"
  needs selected_values : Array(String) = [] of String

  def render
    div class: "space-y-2 max-h-#{max_height} overflow-y-auto" do
      items.each do |item|
        render_checkbox_item(item)
      end
    end
  end

  private def render_checkbox_item(item)
    value = item_value.call(item)
    label_text = item_label.call(item)
    is_checked = selected_values.includes?(value)

    label class: "flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300" do
      input type: "checkbox", name: name, value: value,
        class: "checkbox checkbox-primary", checked: is_checked

      if show_avatar && item.responds_to?(:name)
        mount UI::Avatar, user: item.as(User), size: "md"
      end

      div class: "flex-1" do
        div label_text, class: "font-semibold"
        if subtitle_proc = item_subtitle
          if subtitle = subtitle_proc.call(item)
            small subtitle, class: "text-sm text-base-content/60"
          end
        end
      end
    end
  end
end
