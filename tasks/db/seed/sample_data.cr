require "../../../spec/support/factories/**"

# Comprehensive seed data for a realistic family "cousinade" scenario
class Db::Seed::SampleData < LuckyTask::Task
  summary "Add sample database records helpful for development"

  def call
    puts "🎉 Creating realistic family reunion data..."

    # Create family organizer
    marie = create_organizer

    # Create task categories for the organizer
    create_task_categories(marie)

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

    # Create event templates
    create_event_templates(marie, grandma_house)

    # Create polls for the summer reunion
    create_polls(summer_reunion, family_members)

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

  private def create_task_categories(user : User)
    return if TaskCategoryQuery.new.for_user(user).any?

    default_categories = [
      {name: "Nourriture", color: "#22C55E"},
      {name: "Boissons", color: "#3B82F6"},
      {name: "Installation", color: "#F59E0B"},
      {name: "Nettoyage", color: "#EF4444"},
      {name: "Divertissement", color: "#A855F7"},
      {name: "Décorations", color: "#EC4899"},
      {name: "Autre", color: "#6B7280"},
    ]

    default_categories.each do |cat|
      SaveTaskCategory.create!(
        name: cat[:name],
        color: cat[:color],
        is_default: true,
        user_id: user.id
      )
    end

    puts "🏷️  Created #{default_categories.size} default task categories"
  end

  private def create_grandma_house(creator : User)
    return LocationQuery.new.name("Maison de Mamie").first if LocationQuery.new.name("Maison de Mamie").any?

    location = SaveLocation.create!(
      name: "Maison de Mamie",
      slug: "maison-mamie",
      description: "La maison familiale où nous nous réunissons depuis des décennies",
      address: "123 Rue des Souvenirs",
      city: "Lyon",
      country: "France",
      postal_code: "69001",
      creator_id: creator.id
    )
    puts "🏠 Created location: Maison de Mamie"
    location
  end

  private def create_community_center(creator : User)
    return LocationQuery.new.name("Centre Communautaire").first if LocationQuery.new.name("Centre Communautaire").any?

    location = SaveLocation.create!(
      name: "Centre Communautaire",
      slug: "centre-communautaire",
      description: "Grande salle parfaite pour les grands rassemblements familiaux",
      address: "456 Avenue de la République",
      city: "Lyon",
      country: "France",
      postal_code: "69003",
      creator_id: creator.id
    )
    puts "🏢 Created location: Centre Communautaire"
    location
  end

  private def create_summer_reunion(creator : User, location : Location)
    return EventQuery.new.name("Réunion Familiale Été 2025").first if EventQuery.new.name("Réunion Familiale Été 2025").any?

    event = SaveEvent.create!(
      name: "Réunion Familiale Été 2025",
      slug: "reunion-ete-2025",
      description: "Notre cousinade annuelle d'été ! BBQ, jeux et retrouvailles avec toute la famille. N'oubliez pas vos maillots de bain pour la piscine !",
      status: Event::Status::Confirmed,
      start_at: Time.utc + 45.days + 14.hours,  # 45 days from now at 2 PM
      end_at: Time.utc + 45.days + 22.hours,    # Same day at 10 PM
      creator_id: creator.id,
      location_id: location.id,
      event_type: "reunion",
      budget: 500.0
    )
    puts "📅 Created event: Réunion Familiale Été 2025"
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
        notes: "Trop hâte ! On amènera les enfants."
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
        notes: "On a hâte d'y être !"
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
        notes: "Désolée, on a un conflit ce week-end :("
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
        name: "Apporter du vin et des boissons",
        category: "Boissons",
        notes: "3-4 bouteilles de vin, jus de fruits pour les enfants",
        status: Task::Status::Pending
      )
      puts "📋 Assigned task to Bob: Apporter du vin et des boissons"
    end

    susan_guest = guests.find { |g| g.user!.name == "Susan Martin" }
    if susan_guest
      SaveTask.create!(
        event_id: event.id,
        guest_id: susan_guest.id,
        name: "Apporter les desserts",
        category: "Nourriture",
        notes: "Options sans gluten appréciées !",
        status: Task::Status::Pending
      )
      puts "📋 Assigned task to Susan: Apporter les desserts"
    end

    mike_guest = guests.find { |g| g.user!.name == "Mike Johnson" }
    if mike_guest
      SaveTask.create!(
        event_id: event.id,
        guest_id: mike_guest.id,
        name: "Installer les tables et chaises",
        category: "Installation",
        status: Task::Status::Pending
      )
      puts "📋 Assigned task to Mike: Installer les tables et chaises"
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
      name: "Préparer le BBQ et les plats principaux",
      category: "Nourriture",
      notes: "Burgers, saucisses, légumes grillés",
      status: Task::Status::InProgress
    )
    puts "📋 Assigned task to Marie: Préparer le BBQ"
  end

  private def complete_tasks(event : Event)
    # For a past event, we can mark some tasks as completed
    # This will be more useful when we create the past event
  end

  private def create_event_templates(creator : User, location : Location)
    return if EventTemplateQuery.new.for_user(creator).any?

    # BBQ Template
    bbq_template = SaveEventTemplate.create!(
      name: "BBQ Familial d'Été",
      description: "Modèle pour nos BBQ d'été annuels",
      location_id: location.id,
      creator_id: creator.id,
      task_templates: [
        {"name" => "Acheter viande et légumes", "category" => "food"},
        {"name" => "Préparer marinades", "category" => "food"},
        {"name" => "Nettoyer le grill", "category" => "setup"},
        {"name" => "Acheter boissons et glace", "category" => "beverages"},
      ].to_json,
      default_guest_ids: "[]"
    )
    puts "📝 Created template: BBQ Familial d'Été"

    # Birthday Template
    birthday_template = SaveEventTemplate.create!(
      name: "Anniversaire",
      description: "Modèle pour les anniversaires familiaux",
      location_id: location.id,
      creator_id: creator.id,
      task_templates: [
        {"name" => "Commander le gâteau", "category" => "food"},
        {"name" => "Acheter décorations", "category" => "decorations"},
        {"name" => "Envoyer les invitations", "category" => "other"},
        {"name" => "Planifier jeux et activités", "category" => "entertainment"},
      ].to_json,
      default_guest_ids: "[]"
    )
    puts "📝 Created template: Anniversaire"
  end

  private def create_polls(event : Event, family_members : Array(User))
    return if PollQuery.new.for_event(event).any?

    # Create a poll about what time works best
    time_poll = SavePoll.create!(
      event_id: event.id,
      question: "Quelle heure vous convient le mieux pour commencer ?",
      is_locked: false
    )

    option1 = SavePollOption.create!(poll_id: time_poll.id, option_text: "14h00 (2 PM)")
    option2 = SavePollOption.create!(poll_id: time_poll.id, option_text: "15h00 (3 PM)")
    option3 = SavePollOption.create!(poll_id: time_poll.id, option_text: "16h00 (4 PM)")

    # Some family members vote
    bob = family_members.find { |m| m.name == "Bob Smith" }
    if bob
      SavePollVote.create!(poll_id: time_poll.id, poll_option_id: option1.id, user_id: bob.id)
    end

    susan = family_members.find { |m| m.name == "Susan Martin" }
    if susan
      SavePollVote.create!(poll_id: time_poll.id, poll_option_id: option2.id, user_id: susan.id)
    end

    mike = family_members.find { |m| m.name == "Mike Johnson" }
    if mike
      SavePollVote.create!(poll_id: time_poll.id, poll_option_id: option1.id, user_id: mike.id)
    end

    puts "📊 Created poll: Quelle heure vous convient le mieux ?"

    # Create a poll about food preferences
    food_poll = SavePoll.create!(
      event_id: event.id,
      question: "Préférence pour le plat principal ?",
      is_locked: false
    )

    SavePollOption.create!(poll_id: food_poll.id, option_text: "Burgers et hot-dogs")
    SavePollOption.create!(poll_id: food_poll.id, option_text: "Côtes levées et poulet")
    SavePollOption.create!(poll_id: food_poll.id, option_text: "Mix des deux")

    puts "📊 Created poll: Préférence pour le plat principal ?"
  end

  private def create_past_event(creator : User, location : Location, family_members : Array(User))
    return if EventQuery.new.name("Dîner de Noël 2024").any?

    past_event = SaveEvent.create!(
      name: "Dîner de Noël 2024",
      slug: "noel-2024",
      description: "Célébration annuelle de Noël avec toute la famille",
      status: Event::Status::Done,
      start_at: Time.utc - 280.days,  # ~9 months ago
      end_at: Time.utc - 280.days + 6.hours,
      creator_id: creator.id,
      location_id: location.id,
      event_type: "holiday",
      budget: 300.0
    )
    puts "📅 Created past event: Dîner de Noël 2024"

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
        name: ["Apporter du vin", "Apporter le dessert", "Installer les décorations"].sample,
        category: ["Boissons", "Nourriture", "Décorations"].sample,
        status: Task::Status::Completed,
        notes: "Coût : €#{rand(20..80)}"
      )

      if start_time = past_event.start_at
        SaveTask.update!(task, completed_at: start_time + rand(1..5).hours)
      end
    end

    puts "✅ Past event created with completed tasks"
  end
end
