class EventTemplates::Index < BrowserAction
  get "/event_templates" do
    templates = EventTemplateQuery.new
      .for_user(current_user)
      .preload_location
      .ordered_by_name
      .results

    html IndexPage, templates: templates
  end
end
