class Events::Delete < BrowserAction
  delete "/events/:event_id" do
    event = EventQuery.find(event_id)
    DeleteEvent.delete(event) do |_operation, _deleted|
      flash.success = "Deleted the event"
      redirect Index
    end
  end
end
