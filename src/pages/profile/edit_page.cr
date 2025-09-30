class Profile::EditPage < MainLayout
  needs user : User

  def page_title
    r("profile.edit_profile").t
  end

  def content
    div class: "max-w-2xl mx-auto" do
      div class: "card bg-base-100 shadow-xl" do
        div class: "card-body" do
          h1 r("profile.edit_profile").t, class: "card-title text-3xl mb-6"

          form_for Profile::Update, class: "space-y-6" do
            # Name field
            div class: "form-control" do
              label r("profile.name").t, class: "label font-semibold"
              input type: "text", name: "user:name", value: user.name, class: "input input-bordered w-full", required: true
            end

            # Email field
            div class: "form-control" do
              label r("profile.email").t, class: "label font-semibold"
              input type: "email", name: "user:email", value: user.email, class: "input input-bordered w-full", required: true
            end

            # Password change section
            div class: "divider" do
              text r("profile.new_password").t
            end

            # Current password (required if changing password)
            div class: "form-control" do
              label r("profile.current_password").t, class: "label font-semibold"
              input type: "password", name: "user:current_password", class: "input input-bordered w-full", placeholder: r("profile.current_password").t
              label class: "label" do
                span r("profile.required_for_password_change").t, class: "label-text-alt"
              end
            end

            # New password
            div class: "form-control" do
              label r("profile.new_password").t, class: "label font-semibold"
              input type: "password", name: "user:password", class: "input input-bordered w-full", placeholder: r("profile.new_password").t
            end

            # Confirm new password
            div class: "form-control" do
              label r("profile.new_password_confirmation").t, class: "label font-semibold"
              input type: "password", name: "user:password_confirmation", class: "input input-bordered w-full", placeholder: r("profile.new_password_confirmation").t
            end

            # Submit buttons
            div class: "card-actions justify-end mt-6" do
              link r("actions.cancel").t, to: Profile::Show, class: "btn btn-ghost"
              button r("actions.save").t, class: "btn btn-primary"
            end
          end
        end
      end
    end
  end
end
