class RsvpConfirmationEmail < BaseEmail
  def initialize(@guest : Guest, @event : Event)
  end

  to @guest.user!.emailable
  from Carbon::Address.new("noreply@fiesta.app")

  def subject : String
    if @guest.status.confirmed?
      "You're confirmed for #{@event.name}"
    else
      "Your response to #{@event.name}"
    end
  end

  def text_body : String
    if @guest.status.confirmed?
      build_confirmed_text
    else
      build_declined_text
    end
  end

  private def build_confirmed_text
    event_details = ""
    if start_at = @event.start_at
      event_details += "When: #{start_at.to_s("%B %-d, %Y at %-I:%M %p")}\n"
    end
    if location = @event.location
      event_details += "Where: #{location.name}\n"
    end

    <<-TEXT
    Thanks for confirming!

    We're looking forward to seeing you at:

    Event: #{@event.name}
    #{event_details}

    View event details: #{Events::Show.url(@event.id)}
    TEXT
  end

  private def build_declined_text
    <<-TEXT
    Thanks for letting us know.

    We're sorry you can't make it to #{@event.name}.

    If you change your mind, you can update your RSVP at:
    #{Events::Show.url(@event.id)}
    TEXT
  end
end