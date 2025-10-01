require "../spec_helper"

describe "Event template flow", tags: "flow" do
  it "allows user to create event template" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id)

    template = EventTemplateFactory.create &.creator_id(user.id)
      .name("Birthday Party Template")
      .description("Standard birthday party setup")
      .location_id(location.id)

    template.name.should eq "Birthday Party Template"
    template.location_id.should eq location.id
  end

  it "allows user to create template with task templates" do
    user = UserFactory.create

    task_templates = [
      {"name" => "Buy cake", "category" => "food"},
      {"name" => "Decorate venue", "category" => "decorations"},
      {"name" => "Send invitations", "category" => "logistics"},
    ]

    template = EventTemplateFactory.create &.creator_id(user.id)
      .name("Party Template")
      .task_templates(task_templates.to_json)

    template.task_list.size.should eq 3
    template.task_list[0]["name"].should eq "Buy cake"
    template.task_list[1]["category"].should eq "decorations"
  end

  it "allows user to create event from template" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id)

    template = EventTemplateFactory.create &.creator_id(user.id)
      .name("Holiday Party Template")
      .location_id(location.id)

    flow = EventFlow.new(user)
    flow.visit Events::CreateFromTemplate.with(template.id), as: user
    flow.fill "name", "Christmas Party 2025"
    flow.click "@create-event-button"

    event = EventQuery.new.creator_id(user.id).name("Christmas Party 2025").first
    event.location_id.should eq location.id
  end

  it "creates tasks from template when creating event" do
    user = UserFactory.create

    task_templates = [
      {"name" => "Order food", "category" => "food"},
      {"name" => "Book DJ", "category" => "entertainment"},
    ]

    template = EventTemplateFactory.create &.creator_id(user.id)
      .task_templates(task_templates.to_json)

    # Create event from template
    event = EventFactory.create &.creator_id(user.id)

    # Manually create tasks based on template
    template.task_list.each do |task_data|
      TaskFactory.create &.event_id(event.id)
        .name(task_data["name"])
        .category(task_data["category"]?)
    end

    TaskQuery.new.event_id(event.id).select_count.should eq 2
    TaskQuery.new.event_id(event.id).category("food").first.name.should eq "Order food"
  end

  it "allows user to save current event as template" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id)
    event = EventFactory.create &.creator_id(user.id).location_id(location.id)

    # Create tasks for event
    TaskFactory.create &.event_id(event.id).name("Setup tables").category("setup")
    TaskFactory.create &.event_id(event.id).name("Clean up").category("cleanup")

    # Save as template
    task_templates = TaskQuery.new.event_id(event.id).map do |task|
      {"name" => task.name, "category" => task.category.to_s}
    end

    template = EventTemplateFactory.create &.creator_id(user.id)
      .name("#{event.name} Template")
      .location_id(event.location_id)
      .task_templates(task_templates.to_json)

    template.task_list.size.should eq 2
    template.location_id.should eq location.id
  end

  it "allows user to update template" do
    user = UserFactory.create

    template = EventTemplateFactory.create &.creator_id(user.id)
      .name("Old Template Name")

    template.update!(name: "New Template Name")

    template.reload
    template.name.should eq "New Template Name"
  end

  it "allows user to delete template" do
    user = UserFactory.create
    template = EventTemplateFactory.create &.creator_id(user.id)

    template_id = template.id
    template.delete

    EventTemplateQuery.new.id(template_id).first?.should be_nil
  end

  it "complete template workflow: create template -> use for event -> modify -> reuse" do
    user = UserFactory.create
    location = LocationFactory.create &.creator_id(user.id).name("Party Hall")

    # Create template
    task_templates = [
      {"name" => "Book catering", "category" => "food"},
      {"name" => "Hire photographer", "category" => "entertainment"},
      {"name" => "Send invites", "category" => "logistics"},
    ]

    template = EventTemplateFactory.create &.creator_id(user.id)
      .name("Wedding Template")
      .description("Standard wedding setup")
      .location_id(location.id)
      .task_templates(task_templates.to_json)

    # Create first event from template
    event1 = EventFactory.create &.creator_id(user.id)
      .name("Alice & Bob Wedding")
      .location_id(template.location_id)

    template.task_list.each do |task_data|
      TaskFactory.create &.event_id(event1.id)
        .name(task_data["name"])
        .category(task_data["category"]?)
    end

    # Verify first event
    event1.location_id.should eq location.id
    TaskQuery.new.event_id(event1.id).select_count.should eq 3

    # Update template
    updated_tasks = task_templates + [{"name" => "Arrange transportation", "category" => "logistics"}]
    template.update!(task_templates: updated_tasks.to_json)

    # Create second event from updated template
    event2 = EventFactory.create &.creator_id(user.id)
      .name("Charlie & Diana Wedding")
      .location_id(template.location_id)

    template.task_list.each do |task_data|
      TaskFactory.create &.event_id(event2.id)
        .name(task_data["name"])
        .category(task_data["category"]?)
    end

    # Verify second event has updated tasks
    TaskQuery.new.event_id(event2.id).select_count.should eq 4
    template.task_list.size.should eq 4
  end
end
