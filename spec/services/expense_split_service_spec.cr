require "../spec_helper"

describe ExpenseSplitService do
  describe ".calculate_split" do
    it "returns empty array for zero expenses" do
      setup = create_event_with_guests(3)
      SaveEvent.update!(setup[:event], total_cost: 0.0)

      splits = ExpenseSplitService.calculate_split(
        setup[:event],
        setup[:guests],
        ExpenseSplitService::SplitMethod::Equal
      )

      splits.size.should eq(0)
    end

    it "splits equally among guests" do
      setup = create_event_with_guests(4)
      SaveEvent.update!(setup[:event], total_cost: 100.0)

      splits = ExpenseSplitService.calculate_split(
        setup[:event],
        setup[:guests],
        ExpenseSplitService::SplitMethod::Equal
      )

      splits.size.should eq(4)
      splits.each do |split|
        split.amount_owed.should eq(25.0)
      end
    end

    it "splits by headcount" do
      setup = create_event_with_guests(3)
      SaveEvent.update!(setup[:event], total_cost: 120.0)

      # Update guest counts
      SaveGuest.update!(setup[:guests][0], guest_count: 1)
      SaveGuest.update!(setup[:guests][1], guest_count: 2)
      SaveGuest.update!(setup[:guests][2], guest_count: 3)

      guests = GuestQuery.new.for_event(setup[:event]).results

      splits = ExpenseSplitService.calculate_split(
        setup[:event],
        guests,
        ExpenseSplitService::SplitMethod::ByHeadcount
      )

      splits.size.should eq(3)
      # Total headcount = 6, cost per person = 20
      splits.find { |s| s.guest.guest_count == 1 }.not_nil!.amount_owed.should eq(20.0)
      splits.find { |s| s.guest.guest_count == 2 }.not_nil!.amount_owed.should eq(40.0)
      splits.find { |s| s.guest.guest_count == 3 }.not_nil!.amount_owed.should eq(60.0)
    end

    it "handles custom split as equal for now" do
      setup = create_event_with_guests(2)
      SaveEvent.update!(setup[:event], total_cost: 50.0)

      splits = ExpenseSplitService.calculate_split(
        setup[:event],
        setup[:guests],
        ExpenseSplitService::SplitMethod::Custom
      )

      splits.size.should eq(2)
      splits.each do |split|
        split.amount_owed.should eq(25.0)
      end
    end

    it "includes correct guest in split result" do
      setup = create_event_with_guests(2)
      SaveEvent.update!(setup[:event], total_cost: 60.0)

      splits = ExpenseSplitService.calculate_split(
        setup[:event],
        setup[:guests],
        ExpenseSplitService::SplitMethod::Equal
      )

      guest_ids = splits.map(&.guest.id)
      guest_ids.should contain(setup[:guests][0].id)
      guest_ids.should contain(setup[:guests][1].id)
    end
  end
end
