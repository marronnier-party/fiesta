class Tasks::TaskCardWithDialog < BaseComponent
  needs task : Task
  needs current_user : User
  needs guests : Array(Guest)

  def render
    mount Tasks::TaskCard,
      task: task,
      comments: [] of Comment,
      current_user: current_user,
      is_organizer: true,
      guests: guests,
      can_comment: true

    mount UI::ConfirmDialog,
      id: "confirm-delete-task-#{task.id}",
      title: r("actions.confirm").t,
      message: r("tasks.delete_confirm").t(name: task.name),
      confirm_text: r("actions.delete").t,
      cancel_text: r("actions.cancel").t,
      confirm_class: "btn-error"
  end
end
