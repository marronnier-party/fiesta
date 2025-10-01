class UI::FormTextarea < BaseComponent
  needs label_text : String
  needs name : String
  needs value : String? = nil
  needs placeholder : String? = nil
  needs rows : Int32 = 3
  needs required : Bool = false
  needs hint : String? = nil

  def render
    div class: "form-control" do
      label label_text, class: "label font-semibold"
      tag "textarea", name: name, class: "textarea textarea-bordered h-#{rows * 8}",
        placeholder: placeholder, required: required do
        text value || ""
      end

      if hint_text = hint
        label class: "label" do
          span hint_text, class: "label-text-alt"
        end
      end
    end
  end
end
