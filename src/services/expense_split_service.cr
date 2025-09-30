class ExpenseSplitService
  enum SplitMethod
    Equal
    ByHeadcount
    Custom
  end

  struct ExpenseSplit
    property guest : Guest
    property amount_owed : Float64

    def initialize(@guest, @amount_owed)
    end
  end

  def self.calculate_split(event : Event, guests : Array(Guest), method : SplitMethod) : Array(ExpenseSplit)
    total_expenses = event.actual_cost
    return [] of ExpenseSplit if total_expenses == 0.0

    splits = [] of ExpenseSplit

    case method
    when SplitMethod::Equal
      # Split equally among all confirmed guests
      per_person = total_expenses / guests.size
      guests.each do |guest|
        splits << ExpenseSplit.new(guest, per_person)
      end

    when SplitMethod::ByHeadcount
      # Split based on guest count (including plus-ones)
      total_headcount = guests.sum(&.guest_count)
      return [] of ExpenseSplit if total_headcount == 0

      per_person = total_expenses / total_headcount
      guests.each do |guest|
        splits << ExpenseSplit.new(guest, per_person * guest.guest_count)
      end

    when SplitMethod::Custom
      # For now, treat as equal split
      # In a real implementation, this would allow custom amounts
      per_person = total_expenses / guests.size
      guests.each do |guest|
        splits << ExpenseSplit.new(guest, per_person)
      end
    end

    splits
  end
end
