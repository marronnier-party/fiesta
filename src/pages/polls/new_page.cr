class Polls::NewPage < MainLayout
  needs event : Event
  needs save_operation : SavePoll

  def page_title
    r("polls.new").t
  end

  def content
    div class: "max-w-2xl mx-auto px-4 py-8" do
      div class: "mb-6" do
        link r("actions.back").t, to: Events::Show.with(event.id), class: "btn btn-ghost btn-sm"
      end

      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("polls.new").t, class: "card-title text-3xl mb-6"

          form_for Polls::Create.with(event.id), class: "space-y-6", id: "poll-form" do
            # Question
            mount UI::FormInput,
              label_text: r("polls.question").t,
              name: "poll:question",
              value: save_operation.question.value.to_s,
              placeholder: r("polls.question_placeholder").t,
              required: true

            # Poll options
            div class: "form-control" do
              label r("polls.options").t, class: "label font-semibold"
              para r("polls.options_hint").t, class: "text-sm text-gray-600 mb-2"

              div id: "poll-options", class: "space-y-2" do
                # Initial 2 options
                2.times do |i|
                  div class: "flex gap-2" do
                    input type: "text",
                      name: "poll_options[]",
                      placeholder: r("polls.option_placeholder").t(number: (i + 1).to_s),
                      class: "input input-bordered flex-1",
                      required: i < 2
                  end
                end
              end

              button type: "button",
                id: "add-option-btn",
                class: "btn btn-ghost btn-sm mt-2" do
                text "+ " + r("polls.add_option").t
              end
            end

            mount UI::Alert,
              message: r("polls.hint").t,
              type: "info"

            # Actions
            div class: "card-actions justify-end mt-8" do
              link r("actions.cancel").t, to: Events::Show.with(event.id), class: "btn btn-ghost"
              button r("actions.create").t, class: "btn btn-primary"
            end
          end
        end
      end
    end

    # JavaScript to add more options
    tag "script" do
      raw <<-JS
        document.getElementById('add-option-btn').addEventListener('click', function() {
          const container = document.getElementById('poll-options');
          const optionCount = container.querySelectorAll('input').length;
          const newOption = document.createElement('div');
          newOption.className = 'flex gap-2';
          newOption.innerHTML = `
            <input type="text" 
                   name="poll_options[]" 
                   placeholder="#{r("polls.option_placeholder").t(number: "${optionCount + 1}")}" 
                   class="input input-bordered flex-1">
            <button type="button" class="btn btn-ghost btn-sm remove-option">✕</button>
          `;
          container.appendChild(newOption);
          
          newOption.querySelector('.remove-option').addEventListener('click', function() {
            newOption.remove();
          });
        });
      JS
    end
  end
end
