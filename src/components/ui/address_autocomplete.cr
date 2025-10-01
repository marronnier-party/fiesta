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

    div class: "form-control w-full relative",
        "x-data": "addressAutocomplete()",
        "x-init": init_handler,
        "@address-selected": "locationData = $event.detail" do

      # Label
      label class: "label" do
        span @label_text + (@required ? " *" : ""), class: "label-text font-semibold"
      end

      # Address input with autocomplete
      input type: "text",
        name: @name,
        "x-model": "query",
        "@input": "search()",
        "@keydown": "handleKeydown($event)",
        placeholder: @placeholder,
        class: "input input-bordered w-full",
        required: @required,
        id: input_id,
        autocomplete: "off"

      # Autocomplete dropdown
      div "x-show": "showResults",
          "x-transition": "",
          class: "absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-auto" do

        tag "template", "x-for": "(result, index) in results", ":key": "result.place_id" do
          div "@click": "selectResult(result)",
              class: "px-4 py-2 hover:bg-base-200 cursor-pointer",
              ":class": "{ 'bg-base-200': index === selectedIndex }" do
            para "x-text": "result.display_name", class: "text-sm"
          end
        end
      end

      # Hidden fields that will be populated by Alpine
      render_hidden_fields

      # Help text
      if help_text_value = @help_text
        label class: "label" do
          span help_text_value, class: "label-text-alt text-base-content/60"
        end
      end
    end
  end

  private def init_handler
    "locationData = {}"
  end

  private def render_hidden_fields
    # City field
    if city_name = @city_name
      input type: "hidden",
        name: city_name,
        "x-model": "locationData.city"
    end

    # Postal code field
    if postal_code_name = @postal_code_name
      input type: "hidden",
        name: postal_code_name,
        "x-model": "locationData.postal_code"
    end

    # Country field
    if country_name = @country_name
      input type: "hidden",
        name: country_name,
        "x-model": "locationData.country"
    end

    # Coordinates
    if latitude_name = @latitude_name
      input type: "hidden",
        name: latitude_name,
        "x-model": "locationData.latitude",
        "@change": "if (locationData.latitude && locationData.longitude) $dispatch('update-map', { lat: locationData.latitude, lng: locationData.longitude })"
    end

    if longitude_name = @longitude_name
      input type: "hidden",
        name: longitude_name,
        "x-model": "locationData.longitude"
    end
  end
end
