module DateFormatHelper
  include Rosetta::Translatable
  # Full date with time: "January 15, 2025 at 2:30 PM"
  def format_datetime_full(time : Time)
    time.to_s("%B %-d, %Y at %-I:%M %p")
  end

  # Full date with time and day: "Monday, January 15, 2025 at 2:30 PM"
  def format_datetime_with_day(time : Time)
    time.to_s("%A, %B %-d, %Y at %-I:%M %p")
  end

  # Formal datetime: "Monday 15 January 2025, 14:30"
  def format_datetime_formal(time : Time)
    time.to_s("%A %d %B %Y, %H:%M")
  end

  # Short date: "Jan 15, 2025"
  def format_date_short(time : Time)
    time.to_s("%b %-d, %Y")
  end

  # Long date: "January 15, 2025"
  def format_date_long(time : Time)
    time.to_s("%B %-d, %Y")
  end

  # Relative time: "2 hours ago", "3 days ago", etc.
  def format_relative_time(time : Time)
    diff = Time.utc - time
    minutes = diff.total_minutes.to_i

    if minutes < 1
      r("time.just_now").t
    elsif minutes < 60
      r("time.minutes_ago").t(count: minutes)
    elsif minutes < 1440 # 24 hours
      hours = (minutes / 60).to_i
      r("time.hours_ago").t(count: hours)
    else
      days = (minutes / 1440).to_i
      r("time.days_ago").t(count: days)
    end
  end

  # Format for datetime-local input: "2025-01-15T14:30"
  def format_datetime_input(time : Time?) : String
    return "" unless time
    time.to_s("%Y-%m-%dT%H:%M")
  end
end
