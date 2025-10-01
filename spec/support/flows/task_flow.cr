class TaskFlow < BaseFlow
  private getter user : User
  private getter event : Event

  def initialize(@user : User, @event : Event)
  end

  def create_task(name : String, category : String? = nil)
    visit Tasks::New.with(event.id), as: user
    fill_form SaveTask,
      name: name,
      event_id: event.id,
      category: category
    click "@create-task-button"
  end

  def assign_task_to_guest(task : Task, guest : Guest)
    visit Tasks::Edit.with(task.id), as: user
    fill "guest_id", guest.id.to_s
    click "@update-task-button"
  end

  def mark_task_in_progress(task : Task)
    visit Tasks::Show.with(task.id), as: user
    click "@start-task-#{task.id}"
  end

  def complete_task(task : Task)
    visit Tasks::Show.with(task.id), as: user
    click "@complete-task-#{task.id}"
  end

  def should_see_task(name : String)
    current_page.should have_element("body", text: name)
  end

  def should_see_task_status(status : String)
    current_page.should have_element("body", text: status)
  end

  def should_see_assigned_to(guest_name : String)
    current_page.should have_element("body", text: guest_name)
  end

  private def current_page
    self
  end
end
