class UI::DependentSelect < BaseComponent
  needs id : String
  needs label_text : String
  needs name : String
  needs options : Array(Tuple(String, String))
  needs selected_value : String? = nil
  needs dependent_url : String
  needs dependent_target : String
  needs trigger_event : String = "change"

  def render
    div class: "form-control" do
      label label_text, class: "label font-semibold"

      tag "select", **attrs(
        id: id,
        name: name,
        class: "select select-bordered w-full",
        hx_get: dependent_url,
        hx_trigger: trigger_event,
        hx_target: dependent_target,
        hx_swap: "innerHTML",
        hx_include: "[name='#{name}']"
      ) do

        options.each do |(value, text)|
          tag "option",
              value: value,
              selected: (selected_value == value) do
            text text
          end
        end
      end
    end
  end
end
