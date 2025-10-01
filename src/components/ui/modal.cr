class UI::Modal < BaseComponent
  needs id : String
  needs title : String
  needs size : String = "md" # sm, md, lg, xl
  needs closeable : Bool = true
  needs open_by_default : Bool = false

  def render(&)
    dialog **attrs(
      id: "modal-#{@id}",
      class: "modal",
      open: @open_by_default.to_s,
      role: "dialog",
      aria_modal: "true",
      aria_labelledby: "modal-title-#{@id}",
      x_data: modal_data,
      x_init: "init($el)"
    ).merge({
      "@open-modal-#{@id}.window" => "open()",
      "@close-modal-#{@id}.window" => "close()"
    }) do

      div class: "modal-box w-full max-w-#{size_class}", role: "document" do
        div class: "flex items-center justify-between mb-4" do
          h3 @title, id: "modal-title-#{@id}", class: "text-lg font-bold"

          if @closeable
            form method: "dialog" do
              button class: "btn btn-sm btn-circle btn-ghost absolute right-2 top-2",
                     "aria-label": "Close dialog" do
                icon "x", "w-4 h-4"
              end
            end
          end
        end

        # Modal content
        yield
      end

      if @closeable
        form method: "dialog", class: "modal-backdrop" do
          button "Close", "aria-label": "Close dialog"
        end
      end
    end
  end

  private def modal_data
    "{
      open() {
        this.$el.showModal();
        // Trap focus within dialog
        const firstFocusable = this.$el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])');
        if (firstFocusable) firstFocusable.focus();
      },
      close() {
        this.$el.close();
      },
      init(el) {
        if (!#{@closeable}) {
          el.addEventListener('cancel', (e) => e.preventDefault());
        }
      }
    }"
  end

  private def size_class
    case @size
    when "sm"
      "sm"
    when "lg"
      "5xl"
    when "xl"
      "7xl"
    else
      "3xl"
    end
  end
end

# To open modal from JavaScript or Alpine:
# window.dispatchEvent(new CustomEvent('open-modal-{id}'))
# $dispatch('open-modal-{id}')
#
# Benefits of native <dialog>:
# - Built-in accessibility (focus trap, ESC key)
# - Native backdrop with ::backdrop pseudo-element
# - Browser-native show/close methods
# - Better semantic HTML
