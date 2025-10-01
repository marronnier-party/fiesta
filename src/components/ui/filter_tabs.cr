class UI::FilterTabs < BaseComponent
  record Tab,
    label : String,
    value : String,
    path : String

  needs tabs : Array(Tab)
  needs current_value : String
  needs style : String = "tabs" # tabs, buttons

  def render
    div class: container_class do
      tabs.each do |tab|
        render_tab(tab)
      end
    end
  end

  private def container_class
    style == "buttons" ? "flex gap-2" : "tabs tabs-boxed w-full"
  end

  private def render_tab(tab)
    is_active = tab.value == current_value

    if style == "buttons"
      a tab.label, href: tab.path,
        class: "btn btn-sm #{is_active ? "btn-primary" : "btn-ghost"}"
    else
      a tab.label, href: tab.path,
        class: "tab #{is_active ? "tab-active" : ""}"
    end
  end
end
