class UI::ConfirmDialog < BaseComponent
  needs id : String
  needs title : String
  needs message : String
  needs confirm_text : String = "Confirm"
  needs cancel_text : String = "Cancel"
  needs confirm_class : String = "btn-error"

  def render
    dialog **attrs(
      id: "modal-#{id}",
      class: "modal",
      x_data: dialog_data,
      x_init: "init($el)"
    ).merge({
      "@open-modal-#{id}.window" => "open($event.detail)",
      "@close-modal-#{id}.window" => "close()"
    }) do

      div class: "modal-box" do
        h3 title, class: "font-bold text-lg mb-4"

        para message, class: "py-4"

        div class: "modal-action" do
          form method: "dialog", class: "flex gap-2" do
            button cancel_text,
                   type: "button",
                   "@click": "close()",
                   class: "btn btn-ghost"

            button confirm_text,
                   type: "button",
                   "@click": "confirm()",
                   class: "btn #{confirm_class}"
          end
        end
      end

      form method: "dialog", class: "modal-backdrop" do
        button "Close", "@click": "close()"
      end
    end
  end

  private def dialog_data
    "{
      confirmAction: null,
      confirmTarget: null,
      confirmSwap: 'outerHTML',

      open(detail) {
        if (detail) {
          this.confirmAction = detail.action;
          this.confirmTarget = detail.target || null;
          this.confirmSwap = detail.swap || 'outerHTML';
        }
        this.\$el.showModal();
      },

      close() {
        this.\$el.close();
        this.confirmAction = null;
        this.confirmTarget = null;
      },

      confirm() {
        if (this.confirmAction) {
          if (typeof this.confirmAction === 'string') {
            // It's a URL - use htmx
            htmx.ajax('DELETE', this.confirmAction, {
              target: this.confirmTarget,
              swap: this.confirmSwap
            });
          } else if (typeof this.confirmAction === 'function') {
            // It's a function - call it
            this.confirmAction();
          }
        }
        this.close();
      },

      init(el) {
        // Prevent closing with ESC without confirmation
        el.addEventListener('cancel', (e) => {
          e.preventDefault();
          this.close();
        });
      }
    }"
  end
end
