class UI::AddressAutocomplete < BaseComponent
  needs label_text : String
  needs name : String
  needs value : String?
  needs placeholder : String = ""
  needs required : Bool = false
  needs help_text : String? = nil
  needs address_name : String? = nil
  needs city_name : String? = nil
  needs postal_code_name : String? = nil
  needs country_name : String? = nil
  needs latitude_name : String? = nil
  needs longitude_name : String? = nil

  def render
    render_address_input
  end

  private def render_address_input
    input_id = "address-input-#{@name.gsub(":", "-")}"
    input_value = @value || ""

    div class: "form-control w-full" do
      # Label
      label class: "label" do
        span @label_text + (@required ? " *" : ""), class: "label-text font-semibold"
      end

      # Simple address input (will add autocomplete via JavaScript later)
      input type: "text",
        name: @name,
        value: input_value,
        placeholder: @placeholder,
        class: "input input-bordered w-full",
        required: @required,
        id: input_id

      # Hidden fields for coordinates
      render_hidden_coordinates

      # Help text
      if help_text_value = @help_text
        label class: "label" do
          span help_text_value, class: "label-text-alt text-base-content/60"
        end
      end
    end
  end

  private def render_hidden_coordinates
    if lat_name = @latitude_name
      lat_id = "latitude-#{@name.gsub(":", "-")}"
      input type: "hidden", name: lat_name, value: "", id: lat_id
    end

    if lng_name = @longitude_name
      lng_id = "longitude-#{@name.gsub(":", "-")}"
      input type: "hidden", name: lng_name, value: "", id: lng_id
    end
  end
end
