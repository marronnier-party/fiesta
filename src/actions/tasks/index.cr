class Tasks::Index < BrowserAction
  param status : String = "all"

  get "/tasks" do
    # Get all guests for current user to find their tasks
    guests = GuestQuery.new
      .for_user(current_user)
      .results

    # Get tasks from those guests
    task_query = TaskQuery.new
      .preload_guest
      .preload_event

    # Filter by guest IDs
    guest_ids = guests.map(&.id)
    if guest_ids.empty?
      tasks = [] of Task
    else
      tasks = task_query
        .guest_id.in(guest_ids)
        .results
    end

    # Filter by status if specified
    filtered_tasks = case status
    when "pending"
      tasks.select { |t| t.status == Task::Status::Pending }
    when "in_progress"
      tasks.select { |t| t.status == Task::Status::InProgress }
    when "completed"
      tasks.select { |t| t.status == Task::Status::Completed }
    else
      tasks
    end

    html IndexPage,
      tasks: filtered_tasks,
      current_filter: status
  end
end
