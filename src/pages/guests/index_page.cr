class Guests::IndexPage < MainLayout
  needs guests : GuestQuery
  quick_def page_title, "All Guests"

  def content
    h1 "All Guests"
    link "New Guest", to: Guests::New
    render_guests
  end

  def render_guests
    ul do
      guests.each do |guest|
        li do
          link "guest.uselesscolumn", to: Guests::Show.with(guest)
        end
      end
    end
  end
end
