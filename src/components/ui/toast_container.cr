class UI::ToastContainer < BaseComponent
  def render
    div id: "toast-container",
        "x-data": "{ toasts: [] }",
        "@add-toast.window": "toasts.push($event.detail); setTimeout(() => toasts.shift(), 5000)",
        class: "fixed top-4 right-4 z-50 space-y-2 max-w-sm" do

      tag "template", "x-for": "(toast, index) in toasts", ":key": "index" do
        div "x-show": "true",
            "x-transition:enter": "transition ease-out duration-300 transform",
            "x-transition:enter-start": "translate-x-full opacity-0",
            "x-transition:enter-end": "translate-x-0 opacity-100",
            "x-transition:leave": "transition ease-in duration-200 transform",
            "x-transition:leave-start": "translate-x-0 opacity-100",
            "x-transition:leave-end": "translate-x-full opacity-0",
            class: "alert shadow-lg",
            ":class": "{
              'alert-success': toast.type === 'success',
              'alert-error': toast.type === 'error',
              'alert-warning': toast.type === 'warning',
              'alert-info': toast.type === 'info'
            }" do
          span "x-text": "toast.message"
          button "@click": "toasts.splice(index, 1)",
                 class: "btn btn-sm btn-ghost btn-circle" do
            text "✕"
          end
        end
      end
    end
  end
end
