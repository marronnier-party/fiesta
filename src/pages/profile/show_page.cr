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
    div class: "flex items-center justify-between" do
      h1 r("profile.title").t, class: "text-3xl font-bold"
      link r("profile.edit_profile").t, to: Profile::Edit, class: "btn btn-primary"
    end
  end

  private def render_profile_info
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center gap-6" do
          # Avatar
          div class: "avatar placeholder" do
            div class: "bg-neutral text-neutral-content rounded-full w-24" do
              span class: "text-3xl" do
                text user.name.split.map(&.[0]).join.upcase[0..1]
              end
            end
          end

          # User info
          div class: "flex-1" do
            h2 user.name, class: "text-2xl font-bold mb-2"
            div class: "space-y-1 text-base-content/70" do
              div class: "flex items-center gap-2" do
                icon "mail", "w-4 h-4"
                text user.email
              end

              div class: "flex items-center gap-2" do
                icon "calendar", "w-4 h-4"
                text r("profile.member_since").t(date: format_date(user.created_at))
              end
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

  private def format_date(time : Time)
    time.to_s("%B %-d, %Y")
  end
end
