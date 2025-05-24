# class Events::LocationMap < BaseComponent
#   needs latitude : Float64?
#   needs longitude : Float64?
#   needs address : String?

#   def render
#     div class: "w-full h-64 rounded-lg overflow-hidden", id: "location-map" do
#       tag "leaflet-map",
#         latitude: latitude || 46.603354,
#         longitude: longitude || 1.888334,
#         zoom: latitude.nil? ? "5" : "15",
#         class: "w-full h-full" do
#         if latitude && longitude
#           tag "leaflet-marker",
#             latitude: latitude,
#             longitude: longitude,
#             title: address
#         end
#       end
#     end
#   end
# end
