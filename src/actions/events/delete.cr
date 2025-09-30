class Events::Delete < BrowserAction
  include RequireEventFromId
  include RequireEventOwnership

  delete "/events/:event_id" do
    DeleteEvent.delete(event) do |_operation, _deleted|
      flash.success = r("events.deleted_successfully").t
      redirect Events::Index
    end
  end
end
