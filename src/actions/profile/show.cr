class Profile::Show < BrowserAction
  include Auth::RequireSignIn
  include Rosetta::Translatable

  get "/profile" do
    # Get events where user is invited
    invited_events = GuestQuery.new
      .user_id(current_user.id)
      .preload_event
      .results
      .map(&.event!)

    # Get events where user is organizer
    organized_events = EventQuery.new
      .creator_id(current_user.id)
      .results

    html ShowPage,
      user: current_user,
      invited_events: invited_events,
      organized_events: organized_events
  end
end
