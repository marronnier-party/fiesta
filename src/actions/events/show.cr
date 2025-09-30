class Events::Show < BrowserAction
  get "/events/:event_id" do
    event = EventQuery.new
      .preload_creator
      .preload_location
      .find(event_id)

    # Load guests with preloaded user data
    guests = GuestQuery.new
      .for_event(event)
      .preload_user
      .results

    # Load tasks for this event
    tasks = TaskQuery.new
      .for_event(event)
      .preload_guest
      .results

    # Load comments for each task
    task_comments = {} of Int64 => Array(Comment)
    tasks.each do |task|
      comments = CommentQuery.new
        .for_task(task)
        .preload_user
        .recent
        .results
      task_comments[task.id] = comments
    end

    # Find current user's guest record if they're invited
    user_guest = guests.find { |g| g.user_id == current_user.id }

    # Load recent activities
    activities = EventActivityQuery.new
      .for_event(event.id)
      .preload_user
      .recent
      .results

    # Get weather forecast if event has location and date
    weather_forecast = if location = event.location
                         if start_at = event.start_at
                           WeatherService.get_forecast(
                             location.latitude,
                             location.longitude,
                             start_at
                           )
                         end
                       end

    html ShowPage,
      event: event,
      guests: guests,
      tasks: tasks,
      task_comments: task_comments,
      user_guest: user_guest,
      activities: activities,
      weather_forecast: weather_forecast
  end
end
