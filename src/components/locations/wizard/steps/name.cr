class Locations::Wizard::Steps::NameAndCreate < Locations::Wizard::Steps::BaseStep
  def step_title
    "Comment s'appelle ce lieu ? 🏡"
  end

  def step_number
    1
  end

  def render_content
    form_for Locations::Wizard::Create.with(current_step: step_number),
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
