class Events::Wizard::Creation::Steps::DateTime < Events::Wizard::Creation::Steps::BaseStep
  def step_title : String
    "C'est pour quand ? 📅"
  end

  def step_number
    2
  end

  def render_content
    form_for Events::Wizard::Creation::UpdateDateTime.with(event_id: event.not_nil!.id),
      class: "space-y-4" do
      div class: "grid grid-cols-1 md:grid-cols-2 gap-4" do
        div class: "form-control" do
          label "Début", class: "label"
          input type: "datetime-local",
            name: "event:start_at",
            value: "", # event.not_nil!.start_at.to_s("%Y-%m-%dT%H:%M"),
            class: "input input-bordered w-full"
        end

        div class: "form-control" do
          label "Fin", class: "label"
          input type: "datetime-local",
            name: "event:end_at",
            value: "", # event.not_nil!.end_at.to_s("%Y-%m-%dT%H:%M"),
            class: "input input-bordered w-full"
        end
      end
    end
  end
end
