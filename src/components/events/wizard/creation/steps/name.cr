class Events::Wizard::Creation::Steps::Name < Events::Wizard::Creation::Steps::BaseStep
  def step_title : String
    "Comment on appelle ton événement ? 🎉"
  end

  def step_number
    1
  end

  def name_value
    return "" unless event
    event.not_nil!.name
  end

  def render_content
    name_value = event ? event.not_nil!.name : ""
    form_for Events::Wizard::Creation::NameAndCreate,
      class: "space-y-4" do
      div class: "form-control" do
        input type: "text",
          name: "event:name",
          value: name_value,
          placeholder: "Ex: Anniversaire de Roger",
          class: "input input-bordered w-full"
      end
      render_next_button
    end
  end
end
