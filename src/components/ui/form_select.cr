class UI::FormSelect(T) < BaseComponent
  needs label_text : String
  needs name : String
  needs options : Array(T) | Array(Tuple(String, String))
  needs selected_value : String | Int64 | Nil = nil
  needs prompt : String? = nil
  needs required : Bool = false
  needs hint : String? = nil
  needs option_value : Proc(T, String)? = nil
  needs option_label : Proc(T, String)? = nil

  def render
    div class: "form-control" do
      label @label_text, class: "label font-semibold"
      tag "select", name: @name, class: "select select-bordered w-full", required: @required.to_s do
        if prompt_text = @prompt
          tag "option", value: "", disabled: true, selected: @selected_value.nil? do
            text prompt_text
          end
        end

        @options.each do |option|
          render_option(option)
        end
      end

      if hint_text = @hint
        label class: "label" do
          span hint_text, class: "label-text-alt"
        end
      end
    end
  end

  private def render_option(option)
    val = get_option_value(option)
    label = get_option_label(option)
    is_selected = val.to_s == @selected_value.to_s

    tag "option", value: val, selected: is_selected do
      text label
    end
  end

  private def get_option_value(option)
    if option.is_a?(Tuple)
      option[0]
    elsif proc = @option_value
      proc.call(option)
    elsif option.responds_to?(:id)
      option.id.to_s
    else
      option.to_s
    end
  end

  private def get_option_label(option)
    if option.is_a?(Tuple)
      option[1]
    elsif proc = @option_label
      proc.call(option)
    elsif option.responds_to?(:name)
      option.name.to_s
    else
      option.to_s
    end
  end
end
