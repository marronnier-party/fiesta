class UI::EmptyState < BaseComponent
  needs title : String
  needs description : String? = nil
  needs icon_name : String = "inbox"
  needs with_card : Bool = true
  needs action_text : String? = nil
  needs action_path : (Lucky::Action.class)? = nil
  needs button_variant : String = "btn-primary"

  def render
    if with_card
      render_with_card
    else
      render_without_card
    end
  end

  private def render_with_card
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body items-center text-center py-12" do
        render_content
      end
    end
  end

  private def render_without_card
    div class: "flex flex-col items-center justify-center py-12 px-4 text-center" do
      render_content
    end
  end

  private def render_content
    div class: "bg-base-300 rounded-full p-6 mb-4" do
      icon icon_name, "w-16 h-16 text-base-content/40"
    end

    h2 title, class: "text-2xl font-bold text-base-content/70 mb-2"

    if desc = description
      para desc, class: "text-base-content/60 mb-6 max-w-md"
    end

    if action_text && action_path
      link action_text, to: action_path, class: "btn #{button_variant} btn-lg"
    end
  end
end
