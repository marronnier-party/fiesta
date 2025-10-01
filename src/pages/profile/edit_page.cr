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
            mount UI::FormInput,
              label_text: r("profile.name").t,
              name: "user:name",
              value: user.name,
              required: true

            # Email field
            mount UI::FormInput,
              label_text: r("profile.email").t,
              name: "user:email",
              value: user.email,
              input_type: "email",
              required: true

            # Password change section
            div class: "divider" do
              text r("profile.new_password").t
            end

            # Current password (required if changing password)
            mount UI::FormInput,
              label_text: r("profile.current_password").t,
              name: "user:current_password",
              input_type: "password",
              placeholder: r("profile.current_password").t,
              hint: r("profile.required_for_password_change").t

            # New password
            mount UI::FormInput,
              label_text: r("profile.new_password").t,
              name: "user:password",
              input_type: "password",
              placeholder: r("profile.new_password").t

            # Confirm new password
            mount UI::FormInput,
              label_text: r("profile.new_password_confirmation").t,
              name: "user:password_confirmation",
              input_type: "password",
              placeholder: r("profile.new_password_confirmation").t

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
