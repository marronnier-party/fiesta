# abstract class Wizard::SummaryItem < BaseComponent
#   needs current_step : Int32
#   needs step_number : Int32
#   needs icon : String
#   needs label : String
#   needs edit_path : String

#   def render
#     return unless should_show?

#     div class: summary_item_class do
#       div class: "flex items-center gap-2" do
#         mount UI::Icon, icon, class: "w-4 h-4"
#         span label, class: "font-medium"
#       end

#       render_content

#       render_edit_link if step_number < current_step
#     end
#   end

#   private def summary_item_class
#     base = "p-3 rounded-lg"
#     base += " bg-base-100" if step_number == current_step
#     base
#   end

#   private def render_edit_link
#     link "Modifier",
#          to: edit_path,
#          class: "text-xs text-primary hover:underline mt-2 block",
#          hx_get: edit_path,
#          hx_target: "#wizard-content"
#   end

#   # Abstract methods
#   abstract def should_show? : Bool
#   abstract def render_content
# end
