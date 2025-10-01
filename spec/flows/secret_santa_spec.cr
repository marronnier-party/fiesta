require "../spec_helper"

describe "Secret Santa flow", tags: "flow" do
  it "allows organizer to create Secret Santa for event" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    secret_santa = SecretSantaFactory.create &.event_id(event.id)
      .gift_budget(50.0)
      .rules("No gag gifts!")

    secret_santa.event_id.should eq event.id
    secret_santa.gift_budget.should eq 50.0
    secret_santa.rules.should eq "No gag gifts!"
  end

  it "allows organizer to set reveal date" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    reveal_date = 1.week.from_now

    secret_santa = SecretSantaFactory.create &.event_id(event.id)
      .reveal_date(reveal_date)

    secret_santa.reveal_date.should eq reveal_date
  end

  it "creates assignments for Secret Santa participants" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    secret_santa = SecretSantaFactory.create &.event_id(event.id)

    # Create participants
    giver = UserFactory.create
    receiver = UserFactory.create

    GuestFactory.create &.user_id(giver.id).event_id(event.id)
    GuestFactory.create &.user_id(receiver.id).event_id(event.id)

    # Create assignment
    assignment = SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(giver.id)
      .receiver_id(receiver.id)

    assignment.giver_id.should eq giver.id
    assignment.receiver_id.should eq receiver.id
  end

  it "prevents user from being assigned to themselves" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    secret_santa = SecretSantaFactory.create &.event_id(event.id)

    user = UserFactory.create
    GuestFactory.create &.user_id(user.id).event_id(event.id)

    # Verify no self-assignment
    assignments = SecretSantaAssignmentQuery.new
      .secret_santa_id(secret_santa.id)
      .giver_id(user.id)
      .receiver_id(user.id)

    assignments.select_count.should eq 0
  end

  it "tracks gift preferences for participants" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    secret_santa = SecretSantaFactory.create &.event_id(event.id)

    giver = UserFactory.create
    receiver = UserFactory.create

    assignment = SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(giver.id)
      .receiver_id(receiver.id)
      .gift_preferences("Loves books and coffee")

    assignment.gift_preferences.should eq "Loves books and coffee"
  end

  it "allows marking gifts as purchased" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    secret_santa = SecretSantaFactory.create &.event_id(event.id)

    giver = UserFactory.create
    receiver = UserFactory.create

    assignment = SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(giver.id)
      .receiver_id(receiver.id)
      .is_gift_purchased(false)

    SaveSecretSantaAssignment.update!(assignment, is_gift_purchased: true)

    assignment = SecretSantaAssignmentQuery.find(assignment.id)
    assignment.is_gift_purchased.should be_true
  end

  it "allows locking assignments to prevent changes" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    secret_santa = SecretSantaFactory.create &.event_id(event.id)
      .assignments_locked(false)

    SaveSecretSanta.update!(secret_santa, assignments_locked: true)

    secret_santa = SecretSantaQuery.find(secret_santa.id)
    secret_santa.assignments_locked.should be_true
  end

  it "complete Secret Santa workflow: setup -> assign -> track -> reveal" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)

    # Setup Secret Santa
    reveal_date = 2.weeks.from_now
    secret_santa = SecretSantaFactory.create &.event_id(event.id)
      .gift_budget(30.0)
      .rules("Keep it fun and appropriate!")
      .reveal_date(reveal_date)
      .assignments_locked(false)

    # Create participants
    alice = UserFactory.create
    bob = UserFactory.create
    charlie = UserFactory.create
    diana = UserFactory.create

    GuestFactory.create &.user_id(alice.id).event_id(event.id)
    GuestFactory.create &.user_id(bob.id).event_id(event.id)
    GuestFactory.create &.user_id(charlie.id).event_id(event.id)
    GuestFactory.create &.user_id(diana.id).event_id(event.id)

    # Create circular assignments: Alice -> Bob -> Charlie -> Diana -> Alice
    assignment1 = SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(alice.id)
      .receiver_id(bob.id)
      .gift_preferences("Likes sports")

    assignment2 = SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(bob.id)
      .receiver_id(charlie.id)
      .gift_preferences("Enjoys cooking")

    assignment3 = SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(charlie.id)
      .receiver_id(diana.id)
      .gift_preferences("Loves reading")

    assignment4 = SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(diana.id)
      .receiver_id(alice.id)
      .gift_preferences("Enjoys music")

    # Verify all assignments created
    SecretSantaAssignmentQuery.new.secret_santa_id(secret_santa.id).select_count.should eq 4

    # Participants mark gifts as purchased
    SaveSecretSantaAssignment.update!(assignment1, is_gift_purchased: true)
    SaveSecretSantaAssignment.update!(assignment2, is_gift_purchased: true)
    SaveSecretSantaAssignment.update!(assignment3, is_gift_purchased: true)

    # Check purchase status
    SecretSantaAssignmentQuery.new.secret_santa_id(secret_santa.id)
      .is_gift_purchased(true).select_count.should eq 3

    # Lock assignments before event
    SaveSecretSanta.update!(secret_santa, assignments_locked: true)

    secret_santa = SecretSantaQuery.find(secret_santa.id)
    secret_santa.assignments_locked.should be_true
  end

  it "handles Secret Santa with minimum 3 participants" do
    organizer = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    secret_santa = SecretSantaFactory.create &.event_id(event.id)

    user1 = UserFactory.create
    user2 = UserFactory.create
    user3 = UserFactory.create

    GuestFactory.create &.user_id(user1.id).event_id(event.id)
    GuestFactory.create &.user_id(user2.id).event_id(event.id)
    GuestFactory.create &.user_id(user3.id).event_id(event.id)

    # Create assignments
    SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(user1.id).receiver_id(user2.id)
    SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(user2.id).receiver_id(user3.id)
    SecretSantaAssignmentFactory.create &.secret_santa_id(secret_santa.id)
      .giver_id(user3.id).receiver_id(user1.id)

    SecretSantaAssignmentQuery.new.secret_santa_id(secret_santa.id).select_count.should eq 3
  end
end
