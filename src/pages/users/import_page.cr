class Users::ImportPage < MainLayout
  def page_title
    r("users.import.title").t
  end

  def content
    div class: "max-w-4xl mx-auto px-4 py-8" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("users.import.title").t, class: "card-title text-3xl mb-6"

          para r("users.import.description").t, class: "mb-6"

          # Instructions
          div class: "alert alert-info mb-6" do
            icon "info-circle", "w-5 h-5"
            div do
              h3 r("users.import.instructions_title").t, class: "font-bold"
              para r("users.import.instructions").t
            end
          end

          # CSV format example
          div class: "mb-6" do
            h3 r("users.import.format_title").t, class: "font-bold mb-2"
            div class: "mockup-code text-sm" do
              pre do
                code do
                  text "name,email\n"
                  text "Jean Dupont,jean@example.com\n"
                  text "Marie Martin,marie@example.com\n"
                  text "Pierre Durand,pierre@example.com"
                end
              end
            end
          end

          # Upload form
          form_for Users::ProcessImport, multipart: true, class: "space-y-6" do
            div class: "form-control" do
              label r("users.import.select_file").t, class: "label font-semibold"
              input type: "file",
                name: "csv_file",
                accept: ".csv",
                class: "file-input file-input-bordered w-full",
                required: true
            end

            div class: "card-actions justify-end mt-8" do
              link r("actions.cancel").t, to: Me::Show, class: "btn btn-ghost"
              button r("users.import.upload").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
