class Events::ExportGuests < BrowserAction
  include Auth::RequireSignIn
  include RequireEventFromId
  include RequireEventOwnership
  include Rosetta::Translatable

  get "/events/:event_id/export_guests" do
    # Get all guests
    guests = GuestQuery.new
      .event_id(event.id)
      .preload_user
      .results

    # Build CSV
    csv_data = String.build do |str|
      # Header row
      str << "Name,Email,Status,Guest Count,Notes\n"

      # Data rows
      guests.each do |guest|
        user = guest.user!
        name = user.name.gsub(",", " ") # Escape commas
        email = user.email
        status = guest.status.to_s
        count = guest.guest_count || 1
        notes = (guest.notes || "").gsub(",", " ").gsub("\n", " ")

        str << "#{name},#{email},#{status},#{count},\"#{notes}\"\n"
      end
    end

    # Set headers and return CSV
    context.response.headers["Content-Type"] = "text/csv"
    context.response.headers["Content-Disposition"] = "attachment; filename=\"#{event.slug}-guests.csv\""
    plain_text csv_data
  end
end
