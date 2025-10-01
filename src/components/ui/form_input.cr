class UI::FormInput < BaseComponent
  needs label_text : String
  needs name : String
  needs value : String? = nil
  needs placeholder : String? = nil
  needs input_type : String = "text"
  needs required : Bool = false
  needs hint : String? = nil

  def render
    div class: "form-control" do
      label @label_text, class: "label font-semibold"

      if ph = @placeholder
        input type: @input_type, name: @name, value: @value.to_s,
          placeholder: ph, class: "input input-bordered w-full", required: @required.to_s
      else
        input type: @input_type, name: @name, value: @value.to_s,
          class: "input input-bordered w-full", required: @required.to_s
      end

      if hint_text = @hint
        label class: "label" do
          span hint_text, class: "label-text-alt"
        end
      end
    end
  end
end
