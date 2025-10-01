class Events::CheckInPage < MainLayout
  needs event : Event
  needs guests : Array(Guest)

  def page_title
    r("checkin.title").t + " - " + event.name
  end

  def content
    div class: "max-w-4xl mx-auto px-4 py-8" do
      div class: "mb-6" do
        link r("actions.back").t + " " + event.name, to: Events::Show.with(event.id), class: "btn btn-ghost btn-sm"
      end

      div class: "space-y-6" do
        render_header
        render_stats
        render_guest_list
      end
    end
  end

  private def render_header
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center justify-between" do
          h1 r("checkin.title").t, class: "card-title text-3xl"
          span "✓", class: "text-4xl text-success"
        end
        para "Enregistrez les invités au fur et à mesure de leur arrivée", class: "text-base-content/70 mt-2"
      end
    end
  end

  private def render_stats
    checked_in = guests.count { |g| g.status == Guest::Status::Attended }
    expected = guests.size

    mount UI::StatsWidget, stats: [
      UI::StatsWidget::Stat.new(
        title: r("checkin.checked_in").t,
        value: checked_in.to_s,
        color: "text-success"
      ),
      UI::StatsWidget::Stat.new(
        title: r("checkin.expected").t,
        value: expected.to_s,
        color: "text-primary"
      ),
      UI::StatsWidget::Stat.new(
        title: "Restant",
        value: (expected - checked_in).to_s,
        color: "text-warning"
      )
    ]
  end

  private def render_guest_list
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 "Invités", class: "card-title text-2xl mb-4"

        div class: "space-y-2" do
          guests.each do |guest|
            render_guest_item(guest)
          end
        end
      end
    end
  end

  private def render_guest_item(guest : Guest)
    is_checked_in = guest.status == Guest::Status::Attended

    div class: "flex items-center justify-between p-4 bg-base-200 rounded-lg #{is_checked_in ? "bg-success/20" : ""}" do
      div class: "flex items-center gap-4" do
        mount UI::Avatar, user: guest.user!, size: "lg", initials_count: 1

        div do
          div guest.user!.name, class: "font-semibold text-lg"
          if guest.guest_count > 1
            small "+#{guest.guest_count - 1} accompagnateurs", class: "text-sm text-base-content/60"
          end
        end
      end

      if is_checked_in
        div class: "flex items-center gap-2" do
          span "✓ Enregistré", class: "badge badge-success badge-lg"
          form_for Guests::UndoCheckIn.with(guest.id), class: "inline" do
            button r("checkin.undo").t, class: "btn btn-sm btn-ghost"
          end
        end
      else
        form_for Guests::CheckIn.with(guest.id), class: "inline" do
          button r("checkin.check_in").t, class: "btn btn-success btn-lg"
        end
      end
    end
  end
end
