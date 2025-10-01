class UI::Map < BaseComponent
  needs latitude : Float64?
  needs longitude : Float64?
  needs zoom : Int32 = 13
  needs height : String = "400px"
  needs editable : Bool = false
  needs latitude_input_name : String? = nil
  needs longitude_input_name : String? = nil

  def render
    div class: "w-full", style: "height: #{@height}" do
      # Map container
      if @editable
        div(
          class: "w-full h-full rounded-lg border border-base-300",
          "x-data": map_data,
          "x-init": "init()",
          "@update-map.window": "updateMarker($event.detail.lat, $event.detail.lng)"
        )
      else
        div(
          class: "w-full h-full rounded-lg border border-base-300",
          "x-data": map_data,
          "x-init": "init()"
        )
      end

      # Hidden inputs for coordinates if editable
      if @editable && @latitude_input_name && @longitude_input_name
        render_coordinate_inputs
      end
    end
  end

  private def map_data
    lat = @latitude || 48.8566 # Default to Paris
    lng = @longitude || 2.3522
    "map(#{lat}, #{lng}, #{@zoom})"
  end

  private def render_coordinate_inputs
    lat_name = @latitude_input_name
    lng_name = @longitude_input_name
    return unless lat_name && lng_name

    div class: "hidden" do
      input(
        type: "hidden",
        name: lat_name,
        "x-model": "latitude"
      )
      input(
        type: "hidden",
        name: lng_name,
        "x-model": "longitude"
      )
    end
  end
end
