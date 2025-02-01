class Events::IndexPage < MainLayout
  needs events : EventQuery
  quick_def page_title, "All Events"

  def content
    h1 "All Events"
    link "New Event", to: Events::New
    render_events
  end

  def render_events
    ul do
      events.each do |event|
        li do
          link event.name, to: Events::Show.with(event)
        end
      end
    end
  end
end
