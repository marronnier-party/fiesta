class Events::ExpenseSplitPage < MainLayout
  needs event : Event
  needs guests : Array(Guest)
  needs splits : Array(ExpenseSplitService::ExpenseSplit)
  needs split_method : String

  def page_title
    r("expense_split.title").t + " - " + event.name
  end

  def content
    div class: "max-w-4xl mx-auto px-4 py-8" do
      div class: "mb-6" do
        link r("actions.back").t + " " + event.name, to: Events::Show.with(event.id), class: "btn btn-ghost btn-sm"
      end

      div class: "space-y-6" do
        render_header
        render_method_selector
        render_split_results
      end
    end
  end

  private def render_header
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h1 r("expense_split.title").t, class: "card-title text-3xl mb-4"

        mount UI::StatsWidget, stats: [
          UI::StatsWidget::Stat.new(
            title: r("expense_split.total_expenses").t,
            value: "$#{"%.2f" % event.actual_cost}",
            color: "text-primary"
          ),
          UI::StatsWidget::Stat.new(
            title: "Invités",
            value: guests.size.to_s,
            color: "text-info"
          ),
          UI::StatsWidget::Stat.new(
            title: r("expense_split.per_person").t,
            value: guests.size > 0 ? "$#{"%.2f" % (event.actual_cost / guests.size)}" : "$0.00",
            color: "text-success"
          )
        ]
      end
    end
  end

  private def render_method_selector
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 r("expense_split.split_method").t, class: "card-title mb-4"

        div class: "flex gap-2" do
          a r("expense_split.equal").t,
            href: Events::ExpenseSplit.path(event.id) + "?method=equal",
            class: "btn #{split_method == "equal" ? "btn-primary" : "btn-outline"}"

          a r("expense_split.by_headcount").t,
            href: Events::ExpenseSplit.path(event.id) + "?method=by_headcount",
            class: "btn #{split_method == "by_headcount" ? "btn-primary" : "btn-outline"}"

          a r("expense_split.custom").t,
            href: Events::ExpenseSplit.path(event.id) + "?method=custom",
            class: "btn #{split_method == "custom" ? "btn-primary" : "btn-outline"}"
        end
      end
    end
  end

  private def render_split_results
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 r("expense_split.amount_owed").t, class: "card-title text-2xl mb-4"

        if splits.empty?
          div class: "text-center py-8 text-base-content/60" do
            para "Aucune dépense à répartir"
          end
        else
          div class: "space-y-3" do
            splits.each do |split|
              render_split_item(split)
            end
          end
        end
      end
    end
  end

  private def render_split_item(split : ExpenseSplitService::ExpenseSplit)
    div class: "flex items-center justify-between p-4 bg-base-200 rounded-lg" do
      div class: "flex items-center gap-3" do
        mount UI::Avatar, user: split.guest.user!, size: "md", initials_count: 1

        div do
          div split.guest.user!.name, class: "font-semibold"
          if split.guest.guest_count > 1
            small "(#{split.guest.guest_count} personnes)", class: "text-sm text-base-content/60"
          end
        end
      end

      div class: "text-right" do
        div "$#{"%.2f" % split.amount_owed}", class: "text-xl font-bold text-success"
      end
    end
  end
end
