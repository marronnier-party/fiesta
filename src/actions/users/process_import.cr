require "csv"

class Users::ProcessImport < BrowserAction
  post "/users/import" do
    file = params.get_file("csv_file")

    if file.nil?
      flash.failure = r("users.import.no_file").t
      redirect to: Users::Import
    else
      process_csv(file)
    end
  end

  private def process_csv(file : Lucky::UploadedFile)
    results = {
      created: [] of String,
      updated: [] of String,
      errors: [] of String
    }

    begin
      csv_content = File.read(file.tempfile.path)
      csv = CSV.new(csv_content, headers: true)

      csv.each do |row|
        name = row["name"]?.try(&.strip)
        email = row["email"]?.try(&.strip)

        if name.nil? || email.nil? || name.empty? || email.empty?
          results[:errors] << "#{r("users.import.missing_fields").t}: #{row.to_s}"
          next
        end

        begin
          # Check if user already exists
          existing_user = UserQuery.new.email(email).first?

          if existing_user
            # Update existing user's name if provided
            User::SaveOperation.update!(existing_user, name: name)
            results[:updated] << "#{name} (#{email})"
          else
            # Create new user with a temporary password
            temp_password = Random::Secure.hex(16)
            User::SaveOperation.create!(
              name: name,
              email: email,
              encrypted_password: Authentic.generate_encrypted_password(temp_password)
            )
            results[:created] << "#{name} (#{email})"
          end
        rescue ex : Exception
          results[:errors] << "#{email || "unknown"}: #{ex.message}"
        end
      end

      flash.success = r("users.import.success").t(
        created: results[:created].size.to_s,
        updated: results[:updated].size.to_s
      )

      if results[:errors].any?
        flash.failure = r("users.import.errors").t(count: results[:errors].size)
      end

      redirect to: Users::Import
    rescue ex : CSV::Error
      flash.failure = r("users.import.invalid_csv").t
      redirect to: Users::Import
    rescue ex : Exception
      flash.failure = "#{r("users.import.failed").t}: #{ex.message}"
      redirect to: Users::Import
    end
  end
end
