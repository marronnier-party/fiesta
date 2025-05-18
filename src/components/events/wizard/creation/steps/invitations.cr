class Events::Wizard::Creation::Steps::Invitations < Events::Wizard::Creation::Steps::BaseStep
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
