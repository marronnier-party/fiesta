abstract class Events::WizardAction < BrowserAction
  include RequireEventFromId
  # Verify user owns the event
  # if event.creator_id != current_user.id
  #   raise Lucky::ForbiddenError.new("Not authorized to access this event")
  # end
end
