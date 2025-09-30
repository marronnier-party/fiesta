class Me::ShowPage < MainLayout
  needs pending_invitations : Array(Guest)
  needs confirmed_events : Array(Guest)
  needs user_tasks : Array(Task)

  def page_title
    "Dashboard"
  end

  def content
    div class: "space-y-8" do
      render_greeting
      render_pending_invitations_section
      render_confirmed_events_section
      render_tasks_section
    end
  end

  private def render_greeting
    div class: "mb-8" do
      h1 class: "text-3xl font-bold text-base-content" do
        text "Welcome back, #{current_user.name.split.first}!"
      end
      para class: "text-base-content/70 mt-2" do
        text "Here's what's happening with your family events"
      end
    end
  end

  private def render_pending_invitations_section
    div class: "mb-8" do
      div class: "flex items-center gap-2 mb-4" do
        icon "alert-triangle", "w-6 h-6 text-warning"
        h2 "Pending Invitations", class: "text-2xl font-semibold"
      end

      if pending_invitations.empty?
        mount Dashboard::EmptyState,
          title: "No pending invitations",
          description: "You're all caught up! You'll see new event invitations here.",
          icon_name: "check-circle"
      else
        div class: "grid grid-cols-1 gap-4" do
          pending_invitations.each do |guest|
            mount Dashboard::InvitationCard, guest: guest
          end
        end
      end
    end
  end

  private def render_confirmed_events_section
    div class: "mb-8" do
      div class: "flex items-center gap-2 mb-4" do
        icon "calendar", "w-6 h-6 text-primary"
        h2 "Your Upcoming Events", class: "text-2xl font-semibold"
      end

      if confirmed_events.empty?
        mount Dashboard::EmptyState,
          title: "No upcoming events",
          description: "You haven't confirmed any events yet. Check your pending invitations above!",
          icon_name: "calendar"
      else
        div class: "grid grid-cols-1 lg:grid-cols-2 gap-4" do
          confirmed_events.each do |guest|
            mount Dashboard::ConfirmedEventCard, guest: guest
          end
        end
      end
    end
  end

  private def render_tasks_section
    div class: "mb-8" do
      div class: "flex items-center justify-between mb-4" do
        div class: "flex items-center gap-2" do
          icon "clipboard-list", "w-6 h-6 text-info"
          h2 "Your Tasks", class: "text-2xl font-semibold"
        end
      end

      if user_tasks.empty?
        mount Dashboard::EmptyState,
          title: "No tasks assigned",
          description: "You don't have any tasks yet. Event organizers will assign tasks as needed.",
          icon_name: "clipboard-list"
      else
        div class: "grid grid-cols-1 gap-3" do
          user_tasks.each do |task|
            mount Dashboard::TaskListItem, task: task
          end
        end
      end
    end
  end
end
