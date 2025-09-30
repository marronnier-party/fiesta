class Home::IndexPage < AuthLayout
  def content
    div class: "min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center px-4" do
      div class: "max-w-4xl w-full" do
        render_hero
        render_features
        render_cta
      end
    end
  end

  def page_title
    "Fiesta - Coordinate Family Events Together"
  end

  private def render_hero
    div class: "text-center mb-16" do
      h1 class: "text-5xl md:text-6xl font-bold mb-6 text-base-content" do
        text "Coordinate Family Events Together"
      end

      para class: "text-xl md:text-2xl text-base-content/70 mb-8" do
        text "RSVP to gatherings, track who's bringing what, and stay connected with your family"
      end

      div class: "flex flex-col sm:flex-row gap-4 justify-center items-center" do
        link "Sign In", to: SignIns::New, class: "btn btn-primary btn-lg"
        link "Join Your Family", to: SignUps::New, class: "btn btn-outline btn-lg"
      end
    end
  end

  private def render_features
    div class: "grid md:grid-cols-3 gap-8 mb-16" do
      render_feature_card(
        icon: "calendar",
        title: "Easy RSVP",
        description: "Let everyone know you're coming with just a few clicks. Add your family members and dietary restrictions."
      )

      render_feature_card(
        icon: "clipboard-list",
        title: "Coordinate Tasks",
        description: "Know who's bringing what. Mark tasks complete and report what you spent. No surprises!"
      )

      render_feature_card(
        icon: "users",
        title: "See Who's Coming",
        description: "Get excited! See the full guest list, who confirmed, and the total headcount."
      )
    end
  end

  private def render_feature_card(icon : String, title : String, description : String)
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body items-center text-center" do
        div class: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4" do
          mount UI::Icon, name: icon, classes: "w-8 h-8 text-primary"
        end

        h3 title, class: "card-title text-2xl mb-2"
        para description, class: "text-base-content/70"
      end
    end
  end

  private def render_cta
    div class: "text-center p-8 rounded-box bg-base-200" do
      h2 class: "text-3xl font-bold mb-4" do
        text "For Family, By Family"
      end

      para class: "text-lg text-base-content/70 mb-6" do
        text "Simple coordination for the events that matter most. No complexity, just connection."
      end

      link "Get Started", to: SignUps::New, class: "btn btn-primary btn-lg"
    end
  end
end
