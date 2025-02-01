class Guests::FormFields < BaseComponent
  needs operation : SaveGuest

  def render
    # mount Shared::Field, operation.uselesscolumn, &.text_input(autofocus: "true")
  end
end
