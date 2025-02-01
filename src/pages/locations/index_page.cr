class Locations::IndexPage < MainLayout
  needs locations : LocationQuery
  quick_def page_title, "All Locations"

  def content
    h1 "All Locations"
    link "New Location", to: Locations::New
    render_locations
  end

  def render_locations
    ul do
      locations.each do |location|
        li do
          link location.name, to: Locations::Show.with(location)
        end
      end
    end
  end
end
