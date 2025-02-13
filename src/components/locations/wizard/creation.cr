class Locations::Wizard::Creation < BaseComponent
  needs current_step : Int32 = 1
  needs location : Location
  needs parent_event : Event? = nil

  def render
    div class: "min-h-screen bg-base-100" do
      render_summary unless location.new_record?
      div class: "max-w-2xl mx-auto px-4 py-8" do
        render_progress_bar
        render_current_step
      end
    end
  end

  private def render_summary
    mount Locations::Wizard::Summary,
      location: location,
      current_step: current_step,
      parent_event: parent_event
  end

  private def render_progress_bar
    div class: "w-full mb-8" do
      ul class: "steps w-full" do
        render_step_indicator "Nom", 1
        render_step_indicator "Adresse", 2
        render_step_indicator "Détails", 3
        render_step_indicator "Aperçu", 4
      end
    end
  end

  private def render_step_indicator(label, step_number)
    li label,
       class: step_class(step_number),
       hx_get: Locations::Wizard::GoToStep.with(
         location_id: location.id,
         current_step: step_number
       ).path,
       hx_target: "#location-wizard-content",
       hx_trigger: "click"
  end

  private def step_class(step_number)
    base = "step cursor-pointer"
    base += " step-primary" if current_step >= step_number
    base
  end

  private def render_current_step
    div id: "location-wizard-content", class: "transition-all duration-300" do
      case current_step
      when 1
        mount Wizard::Steps::Name, location: location
      when 2
        mount Wizard::Steps::Address, location: location
      when 3
        mount Wizard::Steps::Details, location: location
      when 4
        mount Wizard::Preview, location: location
      end
    end
  end
end
