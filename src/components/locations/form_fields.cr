class Locations::FormFields < BaseComponent
  needs operation : SaveLocation

  def render
    mount Shared::Field, operation.name, &.text_input(autofocus: "true")
    mount Shared::Field, operation.description
  end
end
