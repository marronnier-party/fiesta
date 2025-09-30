require "../spec_helper"

describe TaskSuggestions do
  it "returns suggestions for birthday events" do
    suggestions = TaskSuggestions.for_event_type("birthday")
    suggestions.should_not be_empty
    suggestions.any? { |s| s[:name].includes?("cake") }.should be_true
  end

  it "returns suggestions for bbq events" do
    suggestions = TaskSuggestions.for_event_type("bbq")
    suggestions.should_not be_empty
    suggestions.any? { |s| s[:name].includes?("grill") || s[:name].includes?("meat") }.should be_true
  end

  it "returns default suggestions for unknown event types" do
    suggestions = TaskSuggestions.for_event_type("unknown_type")
    suggestions.should_not be_empty
    suggestions.should eq(TaskSuggestions.for_event_type("other"))
  end

  it "returns default suggestions for nil event type" do
    suggestions = TaskSuggestions.for_event_type(nil)
    suggestions.should_not be_empty
  end

  it "provides list of available event types" do
    types = TaskSuggestions.event_types
    types.should contain("birthday")
    types.should contain("bbq")
    types.should contain("wedding")
  end
end
