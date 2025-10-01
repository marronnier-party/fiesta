class UI::TaskStatusIcon < BaseComponent
  needs status : Task::Status
  needs size : String = "md"

  def render
    icon icon_name, "#{icon_size_class} #{icon_color}"
  end

  private def icon_name : String
    case status
    when Task::Status::Pending
      "circle"
    when Task::Status::InProgress
      "clock"
    when Task::Status::Completed
      "check-circle"
    else
      "circle"
    end
  end

  private def icon_color
    case status
    when Task::Status::Pending
      "text-base-content/40"
    when Task::Status::InProgress
      "text-warning"
    when Task::Status::Completed
      "text-success"
    end
  end

  private def icon_size_class
    case size
    when "sm"
      "w-4 h-4"
    when "lg"
      "w-6 h-6"
    else
      "w-5 h-5"
    end
  end
end
