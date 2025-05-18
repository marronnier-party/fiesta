class Events::Wizard::Creation::Container < BaseComponent
  needs current_step : Int32 = 1
  needs event : Event? = nil
  needs location : Location? = nil
  needs current_user : User

  def render
    div class: "min-h-screen bg-base-100" do
      render_summary unless event.nil?
      div class: "max-w-2xl mx-auto px-4 py-8" do
        render_progress_bar
        render_current_step
      end
    end
  end

  private def render_summary
    mount Events::Wizard::Creation::Summary,
      event: event.not_nil!,
      current_step: current_step,
      location: location
  end

  private def render_progress_bar
    div class: "w-full mb-8" do
      ul class: "steps w-full" do
        render_step_indicator "Nom", 1
        render_step_indicator "Date & Heure", 2
        render_step_indicator "Lieu", 3
        render_step_indicator "Description", 4
        render_step_indicator "Invitations", 5
        render_step_indicator "Aperçu", 6
      end
    end
  end

  private def render_step_indicator(label, step_number)
    li label,
      class: step_class(step_number),
      hx_get: Events::Wizard::Creation::GoToStep.with(current_step: step_number, event_id: event.not_nil!.id).path,
      hx_target: "#wizard-content",
      hx_trigger: "click"
  end

  private def step_class(step_number)
    base = "step cursor-pointer"
    base += " step-primary" if current_step >= step_number
    base
  end

  private def render_current_step
    div id: "wizard-content", class: "transition-all duration-300" do
      case current_step
      when 1
        mount Events::Wizard::Creation::Steps::Name, event: event
      when 2
        mount Events::Wizard::Creation::Steps::DateTime, event: event
      when 3
        mount Events::Wizard::Creation::Steps::Location,
          event: event,
          location: location,
          current_user: current_user
      when 4
        mount Events::Wizard::Creation::Steps::Description, event: event
      # when 5
      #   mount Events::Wizard::Creation::Steps::Invitations,
      #     event: event,
      #     current_user: current_user
      when 5 # New preview step
        mount Events::Wizard::Creation::Steps::Preview,
          event: event.not_nil!,
          location: location
      end
    end
  end
end
