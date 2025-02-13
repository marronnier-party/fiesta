class Events::Wizard::Steps::Invitations < Events::Wizard::Steps::BaseStep
  def step_title : String
    "Qui souhaites-tu inviter ? 👥"
  end

  def step_number
    5
  end

  def render_content
    mount Events::InviteGuests,
      event: event
  end
end
