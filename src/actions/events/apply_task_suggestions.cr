class Events::ApplyTaskSuggestions < BrowserAction
  include RequireEventFromId

  post "/events/:event_id/apply_task_suggestions" do
    # Only event creator can apply suggestions
    if event.creator_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Events::Show.with(event.id)
    end

    # Get selected task names from params
    selected_tasks = params.get_all?("selected_tasks[]") || [] of String

    # Get suggestions for this event type
    suggestions = TaskSuggestions.for_event_type(event.event_type)

    # Create tasks for selected suggestions
    created_count = 0
    suggestions.each do |suggestion|
      if selected_tasks.includes?(suggestion[:name])
        SaveTask.create!(
          event_id: event.id,
          name: suggestion[:name],
          category: suggestion[:category],
          status: :pending
        )
        created_count += 1
      end
    end

    if created_count > 0
      flash.success = r("task_suggestions.created").t(count: created_count)
    else
      flash.info = r("task_suggestions.none_selected").t
    end

    redirect to: Events::Show.with(event.id)
  end
end
