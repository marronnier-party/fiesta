class Profile::ShowPage < MainLayout
  needs user : User
  needs invited_events : Array(Event)
  needs organized_events : Array(Event)

  def page_title
    r("profile.title").t
  end

  def content
    div class: "max-w-4xl mx-auto space-y-6" do
      render_profile_header
      render_profile_info
      render_events_summary
    end
  end

  private def render_profile_header
    mount UI::PageHeader,
      title: r("profile.title").t,
      action_text: r("profile.edit_profile").t,
      action_path: Profile::Edit.route
  end

  private def render_profile_info
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center gap-6" do
          # Avatar
          mount UI::Avatar, user: user, size: "xl"

          # User info
          div class: "flex-1" do
            h2 user.name, class: "text-2xl font-bold mb-2"
            div class: "space-y-1 text-base-content/70" do
              mount UI::InfoRow,
                icon_name: "mail",
                text: user.email,
                size: "sm"

              mount UI::InfoRow,
                icon_name: "calendar",
                text: r("profile.member_since").t(date: format_date_long(user.created_at)),
                size: "sm"
            end
          end
        end
      end
    end
  end

  private def render_events_summary
    div class: "grid md:grid-cols-2 gap-6" do
      # Invited events
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h3 r("profile.events_invited").t, class: "card-title mb-4"

          if invited_events.empty?
            para r("profile.no_invited_events").t, class: "text-base-content/70"
          else
            div class: "space-y-2" do
              invited_events.first(5).each do |event|
                render_event_link(event)
              end

              if invited_events.size > 5
                para class: "text-sm text-base-content/60 mt-2" do
                  text r("profile.and_more").t(count: invited_events.size - 5)
                end
              end
            end
          end
        end
      end

      # Organized events
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h3 r("profile.events_organized").t, class: "card-title mb-4"

          if organized_events.empty?
            para r("profile.no_organized_events").t, class: "text-base-content/70"
          else
            div class: "space-y-2" do
              organized_events.first(5).each do |event|
                render_event_link(event)
              end

              if organized_events.size > 5
                para class: "text-sm text-base-content/60 mt-2" do
                  text r("profile.and_more").t(count: organized_events.size - 5)
                end
              end
            end
          end
        end
      end
    end
  end

  private def render_event_link(event : Event)
    link to: Events::Show.with(event.id), class: "flex items-center gap-2 p-2 hover:bg-base-200 rounded" do
      icon "calendar", "w-4 h-4"
      text event.name
    end
  end

end
