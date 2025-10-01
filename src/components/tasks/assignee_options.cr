class Tasks::AssigneeOptions < BaseComponent
  needs guests : Array(Guest)
  needs include_default : Bool = true

  def render
    if @include_default
      tag "option", value: "", disabled: true, selected: true do
        text r("tasks.select_assignee").t
      end
    end

    if @guests.empty?
      tag "option", value: "", disabled: true do
        text r("tasks.no_assignees_available").t
      end
    else
      @guests.each do |guest|
        tag "option", value: guest.id.to_s do
          status_emoji = case guest.status
          when Guest::Status::Confirmed
            "✓"
          when Guest::Status::NoAnswer
            "?"
          else
            "✗"
          end
          text "#{status_emoji} #{guest.user!.name}"
        end
      end
    end
  end
end
