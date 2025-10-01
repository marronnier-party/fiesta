class Events::ShowMessages < BrowserAction
  get "/events/:event_id/messages" do
    event = EventQuery.new
      .preload_creator
      .find(event_id)

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
