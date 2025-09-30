class EventTemplates::Delete < BrowserAction
  delete "/event_templates/:event_template_id" do
    template = EventTemplateQuery.new
      .for_user(current_user)
      .find(event_template_id)

    template.delete
    flash.success = r("event_templates.deleted").t
    redirect to: EventTemplates::Index
  end
end
