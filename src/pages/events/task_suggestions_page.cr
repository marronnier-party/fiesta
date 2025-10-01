class Events::TaskSuggestionsPage < MainLayout
  needs event : Event
  needs suggestions : Array(NamedTuple(name: String, category: String))

  def page_title
    r("task_suggestions.title").t
  end

  def content
    div class: "max-w-4xl mx-auto px-4 py-8" do
      div class: "mb-6" do
        link r("actions.back").t + " " + event.name, to: Events::Show.with(event.id), class: "btn btn-ghost btn-sm"
      end

      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("task_suggestions.title").t, class: "card-title text-3xl mb-2"
          para r("task_suggestions.subtitle").t(event_type: format_event_type(event.event_type)), class: "text-gray-600 mb-6"

          form_for Events::ApplyTaskSuggestions.with(event.id), class: "space-y-6" do
            mount UI::Alert,
              message: r("task_suggestions.hint").t,
              type: "info"

            # Group suggestions by category
            grouped = suggestions.group_by { |s| s[:category] }

            grouped.each do |category, tasks|
              div class: "mb-6" do
                h2 translate_category(category), class: "text-xl font-semibold mb-3"

                div class: "space-y-2" do
                  tasks.each do |task|
                    div class: "form-control" do
                      label class: "label cursor-pointer justify-start gap-3" do
                        input type: "checkbox",
                          name: "selected_tasks[]",
                          value: task[:name],
                          class: "checkbox checkbox-primary",
                          checked: true
                        span task[:name], class: "label-text"
                      end
                    end
                  end
                end
              end
            end

            div class: "divider"

            div class: "card-actions justify-end mt-6" do
              link r("actions.cancel").t, to: Events::Show.with(event.id), class: "btn btn-ghost"
              button r("task_suggestions.apply").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end

  private def format_event_type(event_type : String?)
    type = event_type || "other"
    type.gsub("_", " ").capitalize
  end

  private def translate_category(category : String)
    case category
    when "food"
      r("tasks.categories.food").t
    when "beverages"
      r("tasks.categories.beverages").t
    when "setup"
      r("tasks.categories.setup").t
    when "cleanup"
      r("tasks.categories.cleanup").t
    when "entertainment"
      r("tasks.categories.entertainment").t
    when "decorations"
      r("tasks.categories.decorations").t
    else
      r("tasks.categories.other").t
    end
  end
end
