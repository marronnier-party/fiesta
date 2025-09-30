class Events::IndexPage < MainLayout
  needs events : Array(Event)

  def page_title
    "My Events"
  end

  def content
    div class: "space-y-6" do
      render_header
      render_events_list
    end
  end

  private def render_header
    div class: "flex items-center justify-between" do
      h1 "My Events", class: "text-3xl font-bold"
      link to: Events::New, class: "btn btn-primary" do
        mount UI::Icon, name: "plus", classes: "w-5 h-5 mr-2"
        text "Create Event"
      end
    end
  end

  private def render_events_list
    if events.empty?
      render_empty_state
    else
      div class: "grid grid-cols-1 gap-4" do
        events.each do |event|
          render_event_card(event)
        end
      end
    end
  end

  private def render_empty_state
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body items-center text-center py-12" do
        div class: "bg-base-300 rounded-full p-6 mb-4" do
          mount UI::Icon, name: "calendar", classes: "w-16 h-16 text-base-content/40"
        end
        h2 "No events yet", class: "card-title text-2xl mb-2"
        para "Create your first family event to get started!", class: "text-base-content/70 mb-6"
        link "Create Event", to: Events::New, class: "btn btn-primary btn-lg"
      end
    end
  end

  private def render_event_card(event : Event)
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-start justify-between" do
          div class: "flex-1" do
            h3 event.name, class: "card-title text-2xl"

            div class: "space-y-2 mt-4" do
              if start_at = event.start_at
                div class: "flex items-center gap-2 text-base-content/80" do
                  mount UI::Icon, name: "calendar", classes: "w-5 h-5"
                  text format_date(start_at)
                end
              end

              if location = event.location
                div class: "flex items-center gap-2 text-base-content/80" do
                  mount UI::Icon, name: "map-pin", classes: "w-5 h-5"
                  text location.name
                end
              end
            end
          end

          render_status_badge(event)
        end

        div class: "card-actions justify-end mt-4" do
          link "View Details", to: Events::Show.with(event.id), class: "btn btn-ghost"
          link "Edit", to: Events::Edit.with(event.id), class: "btn btn-primary"
        end
      end
    end
  end

  private def render_status_badge(event : Event)
    case event.status
    when Event::Status::Draft
      span "Draft", class: "badge badge-warning"
    when Event::Status::Confirmed
      span "Published", class: "badge badge-success"
    when Event::Status::Cancelled
      span "Cancelled", class: "badge badge-error"
    when Event::Status::Done
      span "Completed", class: "badge badge-ghost"
    end
  end

  private def format_date(time : Time)
    time.to_s("%B %-d, %Y at %-I:%M %p")
  end
end
