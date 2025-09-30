class Events::Update < BrowserAction
  include RequireEventFromId
  include RequireEventOwnership

  put "/events/:event_id" do
    old_start_at = event.start_at

    SaveEvent.update(event, params) do |operation, updated_event|
      if operation.saved?
        # Check if date changed
        if old_start_at != updated_event.start_at && updated_event.start_at
          # Create activity for date change
          SaveEventActivity.create!(
            event_id: updated_event.id,
            user_id: current_user.id,
            activity_type: "date_changed",
            description: r("events.activity.date_changed").t(
              old_date: old_start_at ? format_date(old_start_at) : "N/A",
              new_date: format_date(updated_event.start_at.not_nil!)
            )
          )

          # TODO: Send email notifications to confirmed guests when email system is implemented
        end

        flash.success = r("events.updated_successfully").t
        redirect Show.with(updated_event.id)
      else
        flash.failure = r("errors.invalid").t
        html EditPage, operation: operation, event: updated_event
      end
    end
  end

  private def format_date(time : Time) : String
    time.to_s("%B %d, %Y at %H:%M")
  end
end
