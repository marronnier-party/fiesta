# class Locations::Wizard::Summary < BaseComponent
#   needs location : Location
#   needs current_step : Int32 = 1
#   needs parent_event : Event?

#   def render
#     div class: "fixed right-4 top-4 w-80 bg-base-200 rounded-lg shadow-xl transition-transform duration-300 overflow-hidden",
#         classList: { "translate-x-96": !show_summary? } do

#       div class: "p-4 bg-base-300 flex justify-between items-center" do
#         h3 "Résumé", class: "font-bold"
#         button "×",
#                class: "btn btn-ghost btn-sm btn-circle",
#                onclick: "this.closest('.fixed').classList.toggle('translate-x-96')"
#       end

#       div class: "p-4 space-y-4" do
#         render_step_summary "Nom", location.name, 1, "home"
#         render_address_summary
#         render_step_summary "Description", location.description, 3, "file-text"
#       end
#     end
#   end

#   private def render_step_summary(label, value, step, icon)
#     return unless value.presence

#     div class: summary_item_class(step) do
#       div class: "flex items-center gap-2" do
#         mount UI::Icon, icon, class: "w-4 h-4"
#         span label, class: "font-medium"
#       end

#       para value.to_s.truncate(50), class: "text-sm mt-1"

#       if step < current_step
#         render_edit_link(step)
#       end
#     end
#   end

#   private def render_address_summary
#     return unless location.address.presence

#     div class: summary_item_class(2) do
#       div class: "flex items-center gap-2" do
#         mount UI::Icon, "map-pin", class: "w-4 h-4"
#         span "Adresse", class: "font-medium"
#       end

#       para class: "text-sm mt-1" do
#         text location.address
#         br
#         text "#{location.postal_code} #{location.city}"
#       end

#       render_edit_link(2) if current_step > 2
#     end
#   end

#   private def render_edit_link(step)
#     link "Modifier",
#          to: Locations::Wizard::GoToStep.with(
#            location_id: location.id,
#            current_step: step
#          ),
#          class: "text-xs text-primary hover:underline mt-2 block",
#          hx_get: Locations::Wizard::GoToStep.with(
#            location_id: location.id,
#            current_step: step
#          ).path,
#          hx_target: "#location-wizard-content"
#   end

#   private def summary_item_class(step)
#     base = "p-3 rounded-lg"
#     base += " bg-base-100" if step == current_step
#     base
#   end

#   private def show_summary?
#     location.name.presence || location.address.presence || location.description.presence
#   end
# end
