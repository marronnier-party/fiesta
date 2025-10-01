class Shared::Navbar < BaseComponent
  needs current_user : User

  def render
    nav class: "navbar bg-base-100 shadow-lg sticky top-0 z-50" do
      render_navbar_start
      render_navbar_center
      render_navbar_end
    end
  end

  private def render_navbar_start
    div class: "navbar-start" do
      # Mobile menu dropdown
      div class: "dropdown" do
        label class: "btn btn-ghost lg:hidden", tabindex: "0" do
          icon "menu", "h-5 w-5"
        end
        ul class: "menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52", tabindex: "0" do
          render_mobile_menu_items
        end
      end

      # Logo/Brand
      link to: Me::Show, class: "btn btn-ghost text-xl" do
        text "🎉 Fiesta"
      end
    end
  end

  private def render_navbar_center
    div class: "navbar-center hidden lg:flex" do
      ul class: "menu menu-horizontal px-1" do
        render_desktop_menu_items
      end
    end
  end

  private def render_navbar_end
    div class: "navbar-end gap-2" do
      # User menu dropdown
      div class: "dropdown dropdown-end" do
        label class: "btn btn-ghost btn-circle avatar", tabindex: "0" do
          mount UI::Avatar, user: current_user, size: "md"
        end

        ul class: "mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52", tabindex: "0" do
          li class: "menu-title" do
            span do
              text current_user.name
              br
              small class: "text-xs opacity-60", text: current_user.email
            end
          end
          li do
            link r("profile.title").t, to: Profile::Show
          end
          li do
            link r("nav.sign_out").t, to: SignIns::Delete, flow_id: "sign-out-button"
          end
        end
      end
    end
  end

  private def render_desktop_menu_items
    li do
      link to: Me::Show, class: nav_link_class(Me::Show) do
        icon "home", "w-4 h-4 mr-1"
        text r("nav.dashboard").t
      end
    end

    # Show "My Tasks" for all users (they might be assigned tasks)
    li do
      link to: Tasks::Index, class: "" do
        icon "clipboard-list", "w-4 h-4 mr-1"
        text r("tasks.my_tasks").t
      end
    end

    # Show organizer menu if user has created events
    if user_is_organizer?
      li do
        link to: Events::Index, class: "" do
          icon "calendar", "w-4 h-4 mr-1"
          text r("nav.my_events").t
        end
      end

      li do
        link to: Locations::Index, class: "" do
          icon "map-pin", "w-4 h-4 mr-1"
          text r("locations.my_locations").t
        end
      end

      li do
        link to: Events::New, class: "btn btn-primary btn-sm" do
          icon "plus", "w-4 h-4 mr-1"
          text r("nav.create_event").t
        end
      end
    end
  end

  private def render_mobile_menu_items
    li do
      link r("nav.dashboard").t, to: Me::Show
    end

    li do
      link r("tasks.my_tasks").t, to: Tasks::Index
    end

    if user_is_organizer?
      li do
        link r("nav.my_events").t, to: Events::Index
      end

      li do
        link r("nav.create_event").t, to: Events::New
      end
    end

    li class: "border-t mt-2 pt-2" do
      link r("nav.sign_out").t, to: SignIns::Delete
    end
  end

  private def nav_link_class(action_class)
    # TODO: Implement active link detection
    ""
  end

  private def user_is_organizer?
    current_user.is_organizer?
  end
end
