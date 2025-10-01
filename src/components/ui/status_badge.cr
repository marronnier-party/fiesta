class UI::StatusBadge < BaseComponent
  needs status : Event::Status | Guest::Status | Task::Status
  needs size : String = "md" # sm, md, lg

  def render
    span status_text, class: badge_classes
  end

  private def badge_classes
    base = "badge"
    color = status_color
    size_class = @size == "sm" ? "badge-sm" : @size == "lg" ? "badge-lg" : ""

    [base, color, size_class].compact.reject(&.empty?).join(" ")
  end

  private def status_color : String
    case status
    # Event statuses
    when Event::Status::Draft
      "badge-warning"
    when Event::Status::Confirmed
      "badge-success"
    when Event::Status::Cancelled
      "badge-error"
    when Event::Status::Done
      "badge-ghost"
    # Guest statuses
    when Guest::Status::Confirmed
      "badge-success"
    when Guest::Status::Attended
      "badge-primary"
    when Guest::Status::NoAnswer
      "badge-warning"
    when Guest::Status::Declined
      "badge-error"
    # Task statuses
    when Task::Status::Pending
      "badge-ghost"
    when Task::Status::InProgress
      "badge-warning"
    when Task::Status::Completed
      "badge-success"
    else
      "badge-ghost"
    end
  end

  private def status_text : String
    case status
    when Event::Status::Draft
      r("events.statuses.draft").t
    when Event::Status::Confirmed
      r("events.statuses.confirmed").t
    when Event::Status::Cancelled
      r("events.statuses.cancelled").t
    when Event::Status::Done
      r("tasks.statuses.completed").t
    when Guest::Status::Confirmed
      r("guests.statuses.confirmed").t
    when Guest::Status::Attended
      r("guests.statuses.attended").t
    when Guest::Status::NoAnswer
      r("guests.statuses.pending").t
    when Guest::Status::Declined
      r("guests.statuses.declined").t
    when Task::Status::Pending
      r("tasks.statuses.pending").t
    when Task::Status::InProgress
      r("tasks.statuses.in_progress").t
    when Task::Status::Completed
      r("tasks.statuses.completed").t
    else
      ""
    end
  end
end
