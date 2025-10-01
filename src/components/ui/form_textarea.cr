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
      label @label_text, class: "label font-semibold"

      if ph = @placeholder
        tag "textarea", name: @name, class: "textarea textarea-bordered h-#{@rows * 8}",
          placeholder: ph, required: @required.to_s do
          text @value || ""
        end
      else
        tag "textarea", name: @name, class: "textarea textarea-bordered h-#{@rows * 8}",
          required: @required.to_s do
          text @value || ""
        end
      end

      if hint_text = @hint
        label class: "label" do
          span hint_text, class: "label-text-alt"
        end
      end
    end
  end
end
