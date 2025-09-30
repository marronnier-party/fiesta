class Events::ShowTaskSuggestions < BrowserAction
  include RequireEventFromId

  get "/events/:event_id/task_suggestions" do
    # Only event creator can view suggestions
    if event.creator_id != current_user.id
      flash.failure = r("errors.unauthorized").t
      return redirect to: Events::Show.with(event.id)
    end

    suggestions = TaskSuggestions.for_event_type(event.event_type)

    html Events::TaskSuggestionsPage,
      event: event,
      suggestions: suggestions
  end
end
