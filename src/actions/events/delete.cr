class Events::Delete < BrowserAction
  include RequireEventFromId
  include RequireEventOwnership

  delete "/events/:event_id" do
    DeleteEvent.delete(event) do |_operation, _deleted|
      flash.success = "Deleted the event"
      redirect Home::Index
    end
  end
end
