class Tasks::IndexPage < MainLayout
  needs tasks : TaskQuery
  quick_def page_title, "All Tasks"

  def content
    h1 "All Tasks"
    link "New Task", to: Tasks::New
    render_tasks
  end

  def render_tasks
    ul do
      tasks.each do |task|
        li do
          link task.name, to: Tasks::Show.with(task)
        end
      end
    end
  end
end
