class Shared::Navbar < BaseComponent
    # needs user : User
  
    def render
        div class: "navbar bg-base-100 shadow-md" do
            div class: "navbar-start" do
              div class: "dropdown" do
                div class: "btn btn-ghost lg:hidden", role: "button", tabindex: "0" do
                  tag "svg", class: "h-5 w-5", fill: "none", stroke: "currentColor", viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" do
                    tag "path", d: "M4 6h16M4 12h8m-8 6h16", stroke_linecap: "round", stroke_linejoin: "round", stroke_width: "2"
                  end
                end
                ul class: "menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52", tabindex: "0" do
                  li do
                    a "Dashboard"
                  end
                  li do
                    a "My Events"
                  end
                end
              end
              a "Event Organizer", class: "btn btn-ghost text-xl"
            end
            div class: "navbar-center hidden lg:flex" do
              ul class: "menu menu-horizontal px-1" do
                li do
                  a "Dashboard"
                end
                li do
                  a "My Events"
                end
              end
            end
            div class: "navbar-end" do
              a "Create Event", class: "btn btn-primary"
            end
          end
    end
  end
  