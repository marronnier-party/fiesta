class EventTemplates::Create < BrowserAction
  post "/event_templates" do
    SaveEventTemplate.create(params, creator_id: current_user.id) do |operation, template|
      if template
        flash.success = r("event_templates.created").t
        redirect to: EventTemplates::Index
      else
        locations = LocationQuery.new.for_user(current_user).results
        flash.failure = r("event_templates.create_failed").t
        html EventTemplates::NewPage, operation: operation, locations: locations
      end
    end
  end
end
