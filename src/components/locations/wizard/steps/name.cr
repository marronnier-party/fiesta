class Locations::Wizard::Steps::Name < Locations::Wizard::Steps::BaseStep
  def step_title
    "Comment s'appelle ce lieu ? 🏡"
  end

  def step_number
    1
  end

  def render_content
    form_for Locations::Wizard::NameAndCreate, #.with(parent_event_id: ***),
      class: "space-y-4" do
      div class: "form-control" do
        input type: "text",
          name: "location:name",
          value: location.name,
          placeholder: "Ex: Maison de Roger",
          class: "input input-bordered w-full",
          required: true,
          minlength: "3",
          maxlength: "100"
      end
    end
  end
end
