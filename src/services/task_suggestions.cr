class TaskSuggestions
  SUGGESTIONS = {
    "birthday" => [
      {name: "Send invitations", category: "other"},
      {name: "Order birthday cake", category: "food"},
      {name: "Buy decorations", category: "decorations"},
      {name: "Plan games/activities", category: "entertainment"},
      {name: "Prepare party favors", category: "other"},
      {name: "Set up tables and chairs", category: "setup"},
      {name: "Coordinate music playlist", category: "entertainment"},
    ],
    "bbq" => [
      {name: "Buy meat and vegetables", category: "food"},
      {name: "Prepare marinades", category: "food"},
      {name: "Get beverages and ice", category: "beverages"},
      {name: "Clean and prepare grill", category: "setup"},
      {name: "Set up outdoor seating", category: "setup"},
      {name: "Prepare side dishes", category: "food"},
      {name: "Clean up after event", category: "cleanup"},
    ],
    "holiday" => [
      {name: "Plan holiday menu", category: "food"},
      {name: "Decorate home", category: "decorations"},
      {name: "Prepare traditional dishes", category: "food"},
      {name: "Buy gifts", category: "other"},
      {name: "Set the table", category: "setup"},
      {name: "Coordinate family activities", category: "entertainment"},
      {name: "Take family photos", category: "other"},
    ],
    "wedding" => [
      {name: "Book venue", category: "setup"},
      {name: "Send invitations", category: "other"},
      {name: "Arrange catering", category: "food"},
      {name: "Book photographer", category: "other"},
      {name: "Plan ceremony", category: "other"},
      {name: "Organize seating chart", category: "setup"},
      {name: "Arrange music/DJ", category: "entertainment"},
      {name: "Order flowers", category: "decorations"},
    ],
    "reunion" => [
      {name: "Create guest list", category: "other"},
      {name: "Book venue", category: "setup"},
      {name: "Plan activities", category: "entertainment"},
      {name: "Arrange catering", category: "food"},
      {name: "Prepare name tags", category: "other"},
      {name: "Create photo display", category: "decorations"},
      {name: "Coordinate travel arrangements", category: "other"},
    ],
    "graduation" => [
      {name: "Send announcements", category: "other"},
      {name: "Order cake", category: "food"},
      {name: "Decorate venue", category: "decorations"},
      {name: "Prepare food", category: "food"},
      {name: "Create photo slideshow", category: "entertainment"},
      {name: "Organize seating", category: "setup"},
      {name: "Plan speeches", category: "other"},
    ],
    "baby_shower" => [
      {name: "Choose theme", category: "decorations"},
      {name: "Send invitations", category: "other"},
      {name: "Plan games", category: "entertainment"},
      {name: "Prepare food and snacks", category: "food"},
      {name: "Buy decorations", category: "decorations"},
      {name: "Organize gift registry", category: "other"},
      {name: "Set up gift table", category: "setup"},
    ],
    "picnic" => [
      {name: "Pack picnic basket", category: "food"},
      {name: "Prepare sandwiches", category: "food"},
      {name: "Bring blankets", category: "setup"},
      {name: "Pack drinks and cooler", category: "beverages"},
      {name: "Bring outdoor games", category: "entertainment"},
      {name: "Prepare snacks", category: "food"},
      {name: "Pack trash bags for cleanup", category: "cleanup"},
    ],
    "other" => [
      {name: "Plan event details", category: "other"},
      {name: "Send invitations", category: "other"},
      {name: "Arrange refreshments", category: "food"},
      {name: "Set up venue", category: "setup"},
      {name: "Clean up after event", category: "cleanup"},
    ],
  }

  def self.for_event_type(event_type : String?)
    type = event_type || "other"
    SUGGESTIONS[type]? || SUGGESTIONS["other"]
  end

  def self.event_types
    SUGGESTIONS.keys
  end
end
