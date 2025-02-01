class Events::FormFields < BaseComponent
  needs operation : SaveEvent

  def render
    mount Shared::Field, operation.name, &.text_input(autofocus: "true")
    mount Shared::Field, operation.description
  end
end
