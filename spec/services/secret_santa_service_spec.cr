require "../spec_helper"

describe SecretSantaService do
  describe ".randomize_assignments" do
    it "returns false with less than 2 participants" do
      setup = create_event_with_organizer
      secret_santa = SecretSantaFactory.create &.event_id(setup[:event].id)
      participants = [] of Guest

      result = SecretSantaService.randomize_assignments(secret_santa, participants)
      result.should be_false
    end

    it "creates assignments for all participants" do
      setup = create_secret_santa_with_participants(4)

      result = SecretSantaService.randomize_assignments(
        setup[:secret_santa],
        setup[:guests]
      )

      result.should be_true

      assignments = SecretSantaAssignmentQuery.new
        .for_secret_santa(setup[:secret_santa])
        .results

      assignments.size.should eq(4)
    end

    it "ensures no one gets themselves" do
      setup = create_secret_santa_with_participants(5)

      result = SecretSantaService.randomize_assignments(
        setup[:secret_santa],
        setup[:guests]
      )

      result.should be_true

      assignments = SecretSantaAssignmentQuery.new
        .for_secret_santa(setup[:secret_santa])
        .results

      assignments.each do |assignment|
        assignment.giver_id.should_not eq(assignment.receiver_id)
      end
    end

    it "deletes existing assignments before creating new ones" do
      setup = create_secret_santa_with_participants(3)

      # First randomization
      SecretSantaService.randomize_assignments(
        setup[:secret_santa],
        setup[:guests]
      )

      first_count = SecretSantaAssignmentQuery.new
        .for_secret_santa(setup[:secret_santa])
        .results.size

      # Second randomization
      SecretSantaService.randomize_assignments(
        setup[:secret_santa],
        setup[:guests]
      )

      second_count = SecretSantaAssignmentQuery.new
        .for_secret_santa(setup[:secret_santa])
        .results.size

      first_count.should eq(3)
      second_count.should eq(3)
    end

    it "creates assignments with pending status" do
      setup = create_secret_santa_with_participants(3)

      SecretSantaService.randomize_assignments(
        setup[:secret_santa],
        setup[:guests]
      )

      assignments = SecretSantaAssignmentQuery.new
        .for_secret_santa(setup[:secret_santa])
        .results

      assignments.all? { |a| a.status.pending? }.should be_true
    end
  end
end
