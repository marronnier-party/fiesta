class UI::Avatar < BaseComponent
  needs user : User
  needs size : String = "md" # xs, sm, md, lg, xl
  needs initials_count : Int32 = 2 # 1 or 2

  def render
    div class: "avatar placeholder" do
      div class: avatar_circle_class do
        span class: text_size_class do
          text user_initials
        end
      end
    end
  end

  private def avatar_circle_class
    "bg-neutral text-neutral-content rounded-full #{circle_size}"
  end

  private def circle_size
    case size
    when "xs"
      "w-6"
    when "sm"
      "w-8"
    when "md"
      "w-10"
    when "lg"
      "w-16"
    when "xl"
      "w-24"
    else
      "w-10"
    end
  end

  private def text_size_class
    case size
    when "xs"
      "text-xs"
    when "sm"
      "text-xs"
    when "md"
      "text-xs"
    when "lg"
      "text-lg"
    when "xl"
      "text-3xl"
    else
      "text-xs"
    end
  end

  private def user_initials
    if initials_count == 1
      user.name[0..0].upcase
    else
      user.name.split.map(&.[0]).join.upcase[0..1]
    end
  end
end
