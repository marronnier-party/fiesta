class UI::Comment < BaseComponent
  needs comment : ::Comment

  def render
    div class: "flex gap-3 p-3 bg-base-100 rounded-lg" do
      mount UI::Avatar, user: comment.user!, size: "sm", initials_count: 1

      div class: "flex-1" do
        div class: "flex items-baseline gap-2" do
          span comment.user!.name, class: "font-semibold text-sm"
          small format_relative_time(comment.created_at), class: "text-xs text-base-content/60"
        end
        para comment.content, class: "text-sm mt-1"
      end
    end
  end
end
