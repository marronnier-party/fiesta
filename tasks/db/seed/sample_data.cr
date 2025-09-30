require "../../../spec/support/factories/**"

# Comprehensive seed data for a realistic family "cousinade" scenario
class Db::Seed::SampleData < LuckyTask::Task
  summary "Add sample database records helpful for development"

  def call
    puts "🎉 Creating realistic family reunion data..."

    # Create family organizer
    marie = create_organizer

    # Create locations
    grandma_house = create_grandma_house(marie)
    community_center = create_community_center(marie)

    # Create upcoming event (Summer 2025 Cousinade)
    summer_reunion = create_summer_reunion(marie, grandma_house)

    # Create family members
    family_members = create_family_members

    # Invite family to summer reunion
    guests = invite_family_to_event(summer_reunion, family_members)

    # Some family members RSVP with their families
    rsvp_families(guests, summer_reunion)

    # Marie assigns tasks
    assign_tasks(summer_reunion, guests)

    # Some tasks are completed with costs
    complete_tasks(summer_reunion)

    # Create past event
    create_past_event(marie, community_center, family_members)

    puts "\n✅ Sample data created successfully!"
    puts "\n📧 You can sign in as:"
    puts "  Organizer: marie@family.com / password"
    puts "  Guest: bob@family.com / password"
    puts "  Guest: susan@family.com / password"
    puts "  Guest: mike@family.com / password"
  end

  private def create_organizer
    return UserQuery.new.email("marie@family.com").first if UserQuery.new.email("marie@family.com").any?

    user = User::SaveOperation.create!(
      name: "Marie Dupont",
      email: "marie@family.com",
      encrypted_password: Authentic.generate_encrypted_password("password")
    )
    puts "👩 Created organizer: Marie Dupont"
    user
  end

  private def create_grandma_house(creator : User)
    return LocationQuery.new.name("Grandma's House").first if LocationQuery.new.name("Grandma's House").any?

    location = SaveLocation.create!(
      name: "Grandma's House",
      slug: "grandmas-house",
      description: "The family home where we've gathered for decades",
      address: "123 Rue des Souvenirs",
      city: "Lyon",
      country: "France",
      postal_code: "69001",
      creator_id: creator.id
    )
    puts "🏠 Created location: Grandma's House"
    location
  end

  private def create_community_center(creator : User)
    return LocationQuery.new.name("Community Center").first if LocationQuery.new.name("Community Center").any?

    location = SaveLocation.create!(
      name: "Community Center",
      slug: "community-center",
      description: "Large hall perfect for big family gatherings",
      address: "456 Avenue de la République",
      city: "Lyon",
      country: "France",
      postal_code: "69003",
      creator_id: creator.id
    )
    puts "🏢 Created location: Community Center"
    location
  end

  private def create_summer_reunion(creator : User, location : Location)
    return EventQuery.new.name("Summer 2025 Family Reunion").first if EventQuery.new.name("Summer 2025 Family Reunion").any?

    event = SaveEvent.create!(
      name: "Summer 2025 Family Reunion",
      slug: "summer-2025-reunion",
      description: "Our annual summer cousinade! BBQ, games, and catching up with everyone. Bring your swimsuits for the pool!",
      status: Event::Status::Confirmed,
      start_at: Time.utc + 45.days + 14.hours,  # 45 days from now at 2 PM
      end_at: Time.utc + 45.days + 22.hours,    # Same day at 10 PM
      creator_id: creator.id,
      location_id: location.id
    )
    puts "📅 Created event: Summer 2025 Family Reunion"
    event
  end

  private def create_family_members
    family = [] of User

    # Uncle Bob's family
    unless UserQuery.new.email("bob@family.com").any?
      bob = User::SaveOperation.create!(
        name: "Bob Smith",
        email: "bob@family.com",
        encrypted_password: Authentic.generate_encrypted_password("password")
      )
      family << bob
      puts "👨 Created: Bob Smith"
    end

    # Aunt Susan's family
    unless UserQuery.new.email("susan@family.com").any?
      susan = User::SaveOperation.create!(
        name: "Susan Martin",
        email: "susan@family.com",
        encrypted_password: Authentic.generate_encrypted_password("password")
      )
      family << susan
      puts "👩 Created: Susan Martin"
    end

    # Cousin Mike
    unless UserQuery.new.email("mike@family.com").any?
      mike = User::SaveOperation.create!(
        name: "Mike Johnson",
        email: "mike@family.com",
        encrypted_password: Authentic.generate_encrypted_password("password")
      )
      family << mike
      puts "👨 Created: Mike Johnson"
    end

    # Cousin Julie
    unless UserQuery.new.email("julie@family.com").any?
      julie = User::SaveOperation.create!(
        name: "Julie Chen",
        email: "julie@family.com",
        encrypted_password: Authentic.generate_encrypted_password("password")
      )
      family << julie
      puts "👩 Created: Julie Chen"
    end

    # Uncle Pierre
    unless UserQuery.new.email("pierre@family.com").any?
      pierre = User::SaveOperation.create!(
        name: "Pierre Dubois",
        email: "pierre@family.com",
        encrypted_password: Authentic.generate_encrypted_password("password")
      )
      family << pierre
      puts "👨 Created: Pierre Dubois"
    end

    family
  end

  private def invite_family_to_event(event : Event, family_members : Array(User))
    guests = [] of Guest

    family_members.each do |member|
      # Skip if already invited
      next if GuestQuery.new.user_id(member.id).event_id(event.id).any?

      guest = SaveGuest.create!(
        user_id: member.id,
        event_id: event.id,
        status: Guest::Status::NoAnswer
      )
      guests << guest
      puts "📧 Invited: #{member.name}"
    end

    guests
  end

  private def rsvp_families(guests : Array(Guest), event : Event)
    # Bob RSVP's with his family
    bob_guest = guests.find { |g| g.user!.name == "Bob Smith" }
    if bob_guest
      SaveGuest.update!(bob_guest,
        status: Guest::Status::Confirmed,
        guest_count: 4,
        notes: "Can't wait! We'll bring the kids."
      )

      # Add Bob's family members
      SaveDependentGuest.create!(guest_id: bob_guest.id, name: "Sarah Smith", age: 38, relationship: "spouse")
      SaveDependentGuest.create!(guest_id: bob_guest.id, name: "Tim Smith", age: 12, relationship: "son", dietary_restrictions: "vegetarian")
      SaveDependentGuest.create!(guest_id: bob_guest.id, name: "Emily Smith", age: 8, relationship: "daughter")

      puts "✅ Bob's family confirmed (4 people)"
    end

    # Susan RSVP's with her family
    susan_guest = guests.find { |g| g.user!.name == "Susan Martin" }
    if susan_guest
      SaveGuest.update!(susan_guest,
        status: Guest::Status::Confirmed,
        guest_count: 3,
        notes: "Looking forward to it!"
      )

      # Add Susan's family
      SaveDependentGuest.create!(guest_id: susan_guest.id, name: "John Martin", age: 42, relationship: "spouse")
      SaveDependentGuest.create!(guest_id: susan_guest.id, name: "Sophie Martin", age: 15, relationship: "daughter", dietary_restrictions: "gluten-free")

      puts "✅ Susan's family confirmed (3 people)"
    end

    # Mike confirms (coming alone)
    mike_guest = guests.find { |g| g.user!.name == "Mike Johnson" }
    if mike_guest
      SaveGuest.update!(mike_guest,
        status: Guest::Status::Confirmed,
        guest_count: 1
      )
      puts "✅ Mike confirmed (1 person)"
    end

    # Julie declines
    julie_guest = guests.find { |g| g.user!.name == "Julie Chen" }
    if julie_guest
      SaveGuest.update!(julie_guest,
        status: Guest::Status::Declined,
        notes: "Sorry, we have a conflict that weekend :("
      )
      puts "❌ Julie declined"
    end

    # Pierre hasn't answered yet (stays as NoAnswer)
    puts "⏳ Pierre hasn't responded yet"
  end

  private def assign_tasks(event : Event, guests : Array(Guest))
    bob_guest = guests.find { |g| g.user!.name == "Bob Smith" }
    if bob_guest
      SaveTask.create!(
        event_id: event.id,
        guest_id: bob_guest.id,
        name: "Bring wine and soft drinks",
        category: "Beverages",
        notes: "3-4 bottles of wine, juice boxes for kids",
        status: Task::Status::Pending
      )
      puts "📋 Assigned task to Bob: Bring wine and soft drinks"
    end

    susan_guest = guests.find { |g| g.user!.name == "Susan Martin" }
    if susan_guest
      SaveTask.create!(
        event_id: event.id,
        guest_id: susan_guest.id,
        name: "Bring desserts",
        category: "Food",
        notes: "Gluten-free options appreciated!",
        status: Task::Status::Pending
      )
      puts "📋 Assigned task to Susan: Bring desserts"
    end

    mike_guest = guests.find { |g| g.user!.name == "Mike Johnson" }
    if mike_guest
      SaveTask.create!(
        event_id: event.id,
        guest_id: mike_guest.id,
        name: "Setup tables and chairs",
        category: "Setup",
        status: Task::Status::Pending
      )
      puts "📋 Assigned task to Mike: Setup tables and chairs"
    end

    # Task for Marie (organizer creates a task for herself)
    marie = UserQuery.new.email("marie@family.com").first
    return unless marie
    marie_guest = guests.find { |g| g.user_id == marie.id }
    unless marie_guest
      marie_guest = SaveGuest.create!(
        user_id: marie.id,
        event_id: event.id,
        status: Guest::Status::Confirmed,
        guest_count: 2
      )
      SaveDependentGuest.create!(guest_id: marie_guest.id, name: "Jacques Dupont", age: 45, relationship: "spouse")
    end

    SaveTask.create!(
      event_id: event.id,
      guest_id: marie_guest.id,
      name: "Prepare BBQ and main dishes",
      category: "Food",
      notes: "Burgers, sausages, grilled vegetables",
      status: Task::Status::InProgress
    )
    puts "📋 Assigned task to Marie: Prepare BBQ"
  end

  private def complete_tasks(event : Event)
    # For a past event, we can mark some tasks as completed
    # This will be more useful when we create the past event
  end

  private def create_past_event(creator : User, location : Location, family_members : Array(User))
    return if EventQuery.new.name("Christmas Dinner 2024").any?

    past_event = SaveEvent.create!(
      name: "Christmas Dinner 2024",
      slug: "christmas-2024",
      description: "Annual Christmas celebration with the whole family",
      status: Event::Status::Done,
      start_at: Time.utc - 280.days,  # ~9 months ago
      end_at: Time.utc - 280.days + 6.hours,
      creator_id: creator.id,
      location_id: location.id
    )
    puts "📅 Created past event: Christmas Dinner 2024"

    # Invite some family members
    family_members[0..2].each do |member|
      guest = SaveGuest.create!(
        user_id: member.id,
        event_id: past_event.id,
        status: Guest::Status::Attended,
        guest_count: rand(1..4)
      )

      # Add some tasks that were completed
      task = SaveTask.create!(
        event_id: past_event.id,
        guest_id: guest.id,
        name: ["Bring wine", "Bring dessert", "Setup decorations"].sample,
        category: ["Beverages", "Food", "Decorations"].sample,
        status: Task::Status::Completed,
        notes: "Cost: €#{rand(20..80)}"
      )

      if start_time = past_event.start_at
        SaveTask.update!(task, completed_at: start_time + rand(1..5).hours)
      end
    end

    puts "✅ Past event created with completed tasks"
  end
end
