class Comments::Create < BrowserAction
  include Auth::RequireSignIn

  post "/comments" do
    commentable_type = params.get("comment:commentable_type")
    commentable_id = params.get("comment:commentable_id").to_i64

    # Authorization check based on commentable type
    authorized = case commentable_type
    when "Task"
      task = TaskQuery.new.preload_event.find(commentable_id)
      event = task.event!
      # Organizer or assigned guest can comment
      event.creator_id == current_user.id ||
        (task.guest_id && task.guest_id == GuestQuery.new.for_user(current_user).for_event(event).first?.try(&.id))
    when "Event"
      event = EventQuery.find(commentable_id)
      # Organizer or invited guest can comment
      event.creator_id == current_user.id ||
        GuestQuery.new.for_user(current_user).for_event(event).first?
    else
      false
    end

    unless authorized
      flash.failure = r("comments.errors.unauthorized").t
      redirect_back fallback: Me::Show
    end

    SaveComment.create(params, user_id: current_user.id) do |operation, comment|
      if operation.saved?
        flash.success = r("comments.created_successfully").t
      else
        flash.failure = r("errors.invalid").t
      end

      # Redirect back to the appropriate page
      case commentable_type
      when "Task"
        task = TaskQuery.new.preload_event.find(commentable_id)
        redirect to: Events::Show.with(task.event_id)
      when "Event"
        redirect to: Events::Show.with(commentable_id)
      else
        redirect_back fallback: Me::Show
      end
    end
  end
end
