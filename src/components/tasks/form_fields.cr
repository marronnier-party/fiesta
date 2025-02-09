class Tasks::FormFields < BaseComponent
  needs operation : SaveTask

  def render
    mount Shared::Field, operation.name, &.text_input(autofocus: "true")
  end
end
