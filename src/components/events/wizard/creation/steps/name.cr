class Events::Wizard::Creation::Steps::Name < Events::Wizard::Steps::BaseStep
  def step_title : String
    "Comment on appelle ton événement ? 🎉"
  end

  def step_number
    1
  end

  def render_content
    form_for Events::Wizard::NameAndCreate,
      class: "space-y-4" do
      div class: "form-control" do
        input type: "text",
          name: "event:name",
          value: event.name,
          placeholder: "Ex: Anniversaire de Roger",
          class: "input input-bordered w-full"
      end
    end
  end
end
