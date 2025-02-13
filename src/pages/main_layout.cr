abstract class MainLayout
  include Lucky::HTMLPage

  # 'needs current_user : User' makes it so that the current_user
  # is always required for pages using MainLayout
  needs current_user : User

  abstract def content
  abstract def page_title

  # MainLayout defines a default 'page_title'.
  #
  # Add a 'page_title' method to your indivual pages to customize each page's
  # title.
  #
  # Or, if you want to require every page to set a title, change the
  # 'page_title' method in this layout to:
  #
  #    abstract def page_title : String
  #
  # This will force pages to define their own 'page_title' method.
  def page_title
    "Welcome"
  end

  def render
    html_doctype

    html lang: "en" do
      mount Shared::LayoutHead, page_title: page_title

      body do
        render_body_test
        mount Shared::FlashMessages, context.flash
        render_signed_in_user
        content
      end
    end
  end

  private def render_signed_in_user
    text current_user.email
    text " - "
    link "Sign out", to: SignIns::Delete, flow_id: "sign-out-button"
  end

  private def render_body_test
    mount Shared::Navbar
    div class: "container mx-auto px-4 py-8" do
      div class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" do
        div class: "card bg-base-100 shadow-xl" do
          figure do
            img alt: "Event", class: "w-full h-48 object-cover", src: "/api/placeholder/400/200"
          end
          div class: "card-body" do
            div class: "flex justify-between items-center" do
              h2 "Tech Conference 2025", class: "card-title"
              div class: "flex items-center" do
                div class: "avatar" do
                  div class: "w-8 rounded-full" do
                    img alt: "Organizer", src: "/api/placeholder/32/32"
                  end
                end
                span "John Doe", class: "ml-2 text-sm"
              end
            end
            div class: "flex items-center text-sm text-gray-600 mb-2" do
              tag "svg", class: "h-5 w-5 mr-2", fill: "none", stroke: "currentColor", viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" do
                tag "path", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", stroke_linecap: "round", stroke_linejoin: "round", stroke_width: "2"
              end
              span "March 15, 2025"
            end
            div class: "flex items-center text-sm text-gray-600 mb-2" do
              tag "svg", class: "h-5 w-5 mr-2", fill: "none", stroke: "currentColor", viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" do
                tag "path", d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", stroke_linecap: "round", stroke_linejoin: "round", stroke_width: "2"
                tag "path", d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z", stroke_linecap: "round", stroke_linejoin: "round", stroke_width: "2"
              end
              span "San Francisco, CA"
            end
            para "Join us for the biggest tech conference of the year, featuring industry leaders and innovative workshops.", class: "text-gray-600 mb-4"
            div class: "stats shadow mb-4" do
              div class: "stat", onclick: "invited_modal.showModal()" do
                div "Invited", class: "stat-title"
                div "45", class: "stat-value text-blue-500"
              end
              div class: "stat", onclick: "confirmed_modal.showModal()" do
                div "Confirmed", class: "stat-title"
                div "32", class: "stat-value text-green-500"
              end
              div class: "stat", onclick: "declined_modal.showModal()" do
                div "Declined", class: "stat-title"
                div "8", class: "stat-value text-red-500"
              end
            end
            div class: "card-actions justify-between items-center" do
              span "$299", classname: "text-primary font-bold"
              button "Register", class: "btn btn-primary"
            end
          end
        end
      end
    end
    dialog class: "modal", id: "invited_modal" do
      div class: "modal-box" do
        h3 "Invited Guests", class: "font-bold text-lg"
        div class: "py-4 space-y-4" do
          div class: "flex items-center space-x-4" do
            div class: "avatar" do
              div class: "w-12 rounded-full" do
                img alt: "Guest", src: "/api/placeholder/48/48"
              end
            end
            div do
              div "Alice Johnson", class: "font-bold"
              div "alice@example.com", class: "text-sm opacity-50"
            end
          end
          div class: "flex items-center space-x-4" do
            div class: "avatar" do
              div class: "w-12 rounded-full" do
                img alt: "Guest", src: "/api/placeholder/48/48"
              end
            end
            div do
              div "Bob Smith", class: "font-bold"
              div "bob@example.com", class: "text-sm opacity-50"
            end
          end
        end
        div class: "modal-action" do
          form method: "dialog" do
            button "Close", class: "btn"
          end
        end
      end
    end
    dialog class: "modal", id: "confirmed_modal" do
      div class: "modal-box" do
        h3 "Confirmed Guests", class: "font-bold text-lg"
        div class: "py-4 space-y-4" do
          div class: "flex items-center space-x-4" do
            div class: "avatar" do
              div class: "w-12 rounded-full" do
                img alt: "Guest", src: "/api/placeholder/48/48"
              end
            end
            div do
              div "Charlie Brown", class: "font-bold"
              div "charlie@example.com", class: "text-sm opacity-50"
            end
          end
          div class: "flex items-center space-x-4" do
            div class: "avatar" do
              div class: "w-12 rounded-full" do
                img alt: "Guest", src: "/api/placeholder/48/48"
              end
            end
            div do
              div "Diana Prince", class: "font-bold"
              div "diana@example.com", class: "text-sm opacity-50"
            end
          end
        end
        div class: "modal-action" do
          form method: "dialog" do
            button "Close", class: "btn"
          end
        end
      end
    end
    dialog class: "modal", id: "declined_modal" do
      div class: "modal-box" do
        h3 "Declined Guests", class: "font-bold text-lg"
        div class: "py-4 space-y-4" do
          div class: "flex items-center space-x-4" do
            div class: "avatar" do
              div class: "w-12 rounded-full" do
                img alt: "Guest", src: "/api/placeholder/48/48"
              end
            end
            div do
              div "Edward Norton", class: "font-bold"
              div "edward@example.com", class: "text-sm opacity-50"
            end
          end
          div class: "flex items-center space-x-4" do
            div class: "avatar" do
              div class: "w-12 rounded-full" do
                img alt: "Guest", src: "/api/placeholder/48/48"
              end
            end
            div do
              div "Fiona Apple", class: "font-bold"
              div "fiona@example.com", class: "text-sm opacity-50"
            end
          end
        end
        div class: "modal-action" do
          form method: "dialog" do
            button "Close", class: "btn"
          end
        end
      end
    end
  end
end
