class UI::Card < BaseComponent
  needs title : String? = nil
  needs title_class : String = "card-title"
  needs body_padding : Bool = true

  def render(&)
    div class: "card bg-base-100 shadow-xl" do
      div class: card_body_class do
        if title
          h2 title, class: title_class
        end
        yield
      end
    end
  end

  private def card_body_class
    body_padding ? "card-body" : "card-body p-0"
  end
end
