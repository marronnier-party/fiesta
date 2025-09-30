class Dashboard::EmptyState < BaseComponent
  needs title : String
  needs description : String
  needs icon_name : String = "inbox"

  def render
    div class: "flex flex-col items-center justify-center py-12 px-4 text-center" do
      div class: "bg-base-300 rounded-full p-6 mb-4" do
        icon icon_name, "w-12 h-12 text-base-content/40"
      end

      h3 title, class: "text-xl font-semibold text-base-content/70 mb-2"
      para description, class: "text-base-content/50 max-w-md"
    end
  end
end
