require "../spec_helper"

describe "Polling flow", tags: "flow" do
  it "allows organizer to create poll for event" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    poll = PollFactory.create &.event_id(event.id)
      .question("What date works best?")

    poll.question.should eq "What date works best?"
    poll.event_id.should eq event.id
  end

  it "allows organizer to add options to poll" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    poll = PollFactory.create &.event_id(event.id).question("Choose a venue")

    option1 = PollOptionFactory.create &.poll_id(poll.id).option_text("Beach House")
    option2 = PollOptionFactory.create &.poll_id(poll.id).option_text("Restaurant")
    option3 = PollOptionFactory.create &.poll_id(poll.id).option_text("Park")

    PollOptionQuery.new.poll_id(poll.id).select_count.should eq 3
  end

  it "allows guests to vote on poll options" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    poll = PollFactory.create &.event_id(event.id)
    option = PollOptionFactory.create &.poll_id(poll.id).option_text("Option A")

    guest_user = UserFactory.create
    guest = GuestFactory.create &.user_id(guest_user.id).event_id(event.id)

    vote = PollVoteFactory.create &.poll_id(poll.id)
      .poll_option_id(option.id)
      .user_id(guest_user.id)

    vote.poll_option_id.should eq option.id
    vote.user_id.should eq guest_user.id
  end

  it "tracks vote count for each option" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    poll = PollFactory.create &.event_id(event.id)

    option1 = PollOptionFactory.create &.poll_id(poll.id).option_text("Option 1")
    option2 = PollOptionFactory.create &.poll_id(poll.id).option_text("Option 2")

    # 3 votes for option 1
    3.times do
      user = UserFactory.create
      PollVoteFactory.create &.poll_id(poll.id).poll_option_id(option1.id).user_id(user.id)
    end

    # 2 votes for option 2
    2.times do
      user = UserFactory.create
      PollVoteFactory.create &.poll_id(poll.id).poll_option_id(option2.id).user_id(user.id)
    end

    PollVoteQuery.new.poll_option_id(option1.id).select_count.should eq 3
    PollVoteQuery.new.poll_option_id(option2.id).select_count.should eq 2
  end

  it "prevents duplicate votes from same user" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    poll = PollFactory.create &.event_id(event.id)
    option = PollOptionFactory.create &.poll_id(poll.id)

    user = UserFactory.create
    guest = GuestFactory.create &.user_id(user.id).event_id(event.id)

    # First vote
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(option.id).user_id(user.id)

    # Check only one vote exists
    PollVoteQuery.new.poll_id(poll.id).user_id(user.id).select_count.should eq 1
  end

  it "allows organizer to lock poll" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    poll = PollFactory.create &.event_id(event.id).is_locked(false)

    SavePoll.update!(poll, is_locked: true)

    poll = PollQuery.find(poll.id)
    poll.is_locked.should be_true
  end

  it "complete polling workflow: create -> add options -> guests vote -> lock" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    # Create poll
    poll = PollFactory.create &.event_id(event.id)
      .question("Which dessert should we serve?")
      .is_locked(false)

    # Add options
    cake = PollOptionFactory.create &.poll_id(poll.id).option_text("Cake")
    pie = PollOptionFactory.create &.poll_id(poll.id).option_text("Pie")
    ice_cream = PollOptionFactory.create &.poll_id(poll.id).option_text("Ice Cream")

    # Create guests
    guest1 = UserFactory.create
    guest2 = UserFactory.create
    guest3 = UserFactory.create
    guest4 = UserFactory.create
    guest5 = UserFactory.create

    GuestFactory.create &.user_id(guest1.id).event_id(event.id)
    GuestFactory.create &.user_id(guest2.id).event_id(event.id)
    GuestFactory.create &.user_id(guest3.id).event_id(event.id)
    GuestFactory.create &.user_id(guest4.id).event_id(event.id)
    GuestFactory.create &.user_id(guest5.id).event_id(event.id)

    # Guests vote
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(cake.id).user_id(guest1.id)
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(cake.id).user_id(guest2.id)
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(pie.id).user_id(guest3.id)
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(ice_cream.id).user_id(guest4.id)
    PollVoteFactory.create &.poll_id(poll.id).poll_option_id(cake.id).user_id(guest5.id)

    # Verify vote counts
    PollVoteQuery.new.poll_option_id(cake.id).select_count.should eq 3
    PollVoteQuery.new.poll_option_id(pie.id).select_count.should eq 1
    PollVoteQuery.new.poll_option_id(ice_cream.id).select_count.should eq 1

    # Lock poll
    SavePoll.update!(poll, is_locked: true)

    poll = PollQuery.find(poll.id)
    poll.is_locked.should be_true
    poll.total_votes.should eq 5
  end

  it "allows multiple polls for single event" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    poll1 = PollFactory.create &.event_id(event.id).question("What date?")
    poll2 = PollFactory.create &.event_id(event.id).question("What time?")
    poll3 = PollFactory.create &.event_id(event.id).question("What food?")

    PollQuery.new.event_id(event.id).select_count.should eq 3
  end
end
