class EventInvitationEmail < BaseEmail
  def initialize(@guest : Guest, @event : Event, @inviter : User)
  end

  to @guest.user!.emailable
  from Carbon::Address.new("noreply@fiesta.app")
  subject "You're invited to #{@event.name}"

  def text_body : String
    event_details = ""
    if start_at = @event.start_at
      event_details += "When: #{start_at.to_s("%B %-d, %Y at %-I:%M %p")}\n"
    end
    if location = @event.location
      event_details += "Where: #{location.name}\n"
    end

    <<-TEXT
    Hi #{@guest.user!.name},

    #{@inviter.name} has invited you to:

    Event: #{@event.name}
    #{@event.description}

    #{event_details}

    To respond to this invitation, visit:
    #{Events::Show.url(@event.id)}

    See you there!
    TEXT
  end
end