class UI::InlineEdit < BaseComponent
  needs value : String
  needs field_name : String
  needs update_url : String
  needs display_class : String = ""
  needs placeholder : String = ""
  needs multiline : Bool = false

  def render
    div "x-data": inline_edit_data,
        class: "inline-edit" do

      # Display mode
      div "x-show": "!editing",
          "@click": "editing = true",
          class: "cursor-pointer hover:bg-base-200 p-2 rounded transition #{@display_class}" do
        span "x-text": "value || '#{escape_js(@placeholder)}'",
             class: @value.empty? ? "text-base-content/50 italic" : ""
        icon "edit", "w-3 h-3 ml-2 opacity-50 inline"
      end

      # Edit mode
      form **attrs(
        class: "flex gap-2",
        x_show: "editing",
        x_cloak: true,
        hx_put: @update_url,
        hx_swap: "none",
        "@htmx:before-request": "saving = true",
        "@htmx:after-request.window": "handleResponse($event)"
      ) do

        if @multiline
          tag "textarea",
              name: @field_name,
              "x-model": "value",
              "x-init": "$nextTick(() => $el.focus())",
              placeholder: @placeholder,
              class: "textarea textarea-bordered textarea-sm flex-1",
              rows: "3",
              "@keydown.escape": "cancel()",
              "@blur.debounce.200ms": "if (!saving) cancel()"
        else
          input type: "text",
                name: @field_name,
                "x-model": "value",
                "x-init": "$nextTick(() => $el.focus())",
                placeholder: @placeholder,
                class: "input input-sm input-bordered flex-1",
                "@keydown.escape": "cancel()",
                "@keydown.enter": "$el.form.requestSubmit()",
                "@blur.debounce.200ms": "if (!saving) cancel()"
        end

        button type: "submit",
               class: "btn btn-sm btn-primary",
               "x-bind:disabled": "saving" do
          span "x-show": "!saving" do
            text "Save"
          end
          span "x-show": "saving", "x-cloak": true do
            mount UI::LoadingSpinner, size: "sm"
          end
        end

        button "@click": "cancel()",
               type: "button",
               class: "btn btn-sm btn-ghost" do
          text "Cancel"
        end
      end
    end
  end

  private def inline_edit_data
    "{
      editing: false,
      value: '#{escape_js(@value)}',
      originalValue: '#{escape_js(@value)}',
      saving: false,

      cancel() {
        this.editing = false;
        this.value = this.originalValue;
        this.saving = false;
      },

      handleResponse(event) {
        this.saving = false;
        if (event.detail.successful) {
          this.editing = false;
          this.originalValue = this.value;
          window.dispatchEvent(new CustomEvent('add-toast', {
            detail: {
              message: 'Updated successfully',
              type: 'success'
            }
          }));
        } else {
          window.dispatchEvent(new CustomEvent('add-toast', {
            detail: {
              message: 'Update failed. Please try again.',
              type: 'error'
            }
          }));
          this.value = this.originalValue;
        }
      }
    }"
  end

  private def escape_js(str : String)
    str.gsub("'", "\\'").gsub("\n", "\\n").gsub("\r", "")
  end
end
