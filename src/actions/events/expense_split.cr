class Events::ExpenseSplit < BrowserAction
  get "/events/:event_id/expense_split" do
    event = EventQuery.new
      .preload_creator
      .find(event_id)

    authorize event, policy: EventPolicy, query: :expense_split?

    # Get confirmed guests
    guests = GuestQuery.new
      .for_event(event)
      .confirmed
      .preload_user
      .results

    # Calculate split (default to equal)
    split_method_param = params.get?("method") || "equal"
    split_method = case split_method_param
                   when "by_headcount"
                     ExpenseSplitService::SplitMethod::ByHeadcount
                   when "custom"
                     ExpenseSplitService::SplitMethod::Custom
                   else
                     ExpenseSplitService::SplitMethod::Equal
                   end

    splits = ExpenseSplitService.calculate_split(event, guests, split_method)

    html ExpenseSplitPage,
      event: event,
      guests: guests,
      splits: splits,
      split_method: split_method_param
  end
end
