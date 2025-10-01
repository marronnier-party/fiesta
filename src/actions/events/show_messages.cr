class Events::ShowMessages < BrowserAction
  include RequireEventWithCreator

  get "/events/:event_id/messages" do
    authorize event, policy: EventPolicy, query: :show_messages?

    messages = EventMessageQuery.new
      .for_event(event)
      .preload_user
      .recent
      .results

    html MessagesPage,
      event: event,
      messages: messages
  end
end
