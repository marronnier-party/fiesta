class UI::SearchBox < BaseComponent
  needs action : String
  needs query : String?
  needs placeholder : String
  needs name : String = "search"
  needs max_width : String = "md"

  def render
    form method: "get", action: @action, class: "max-w-#{@max_width}" do
      div class: "form-control" do
        div class: "input-group" do
          input type: "text", name: @name, value: @query || "",
            placeholder: @placeholder, class: "input input-bordered w-full"
          button type: "submit", class: "btn btn-square" do
            icon "search", "w-5 h-5"
          end
        end
      end
    end
  end
end
