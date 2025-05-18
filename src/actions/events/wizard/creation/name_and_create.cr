class Events::Wizard::Creation::NameAndCreate < BrowserAction
  post "/events/wizard/creation/name_and_create" do
      SaveEvent.create(params, creator: current_user) do |operation, event|
        if operation.saved?
          if htmx?
            component Events::Wizard::Creation::Container,
              current_step: 2,
              event: event,
              current_user: current_user
          else
            redirect to: Events::Wizard::Creation::GoToStep.with(
              current_step: 2,
              event_id: event.id
            )
          end
        else
          if htmx?
            component Events::Wizard::Creation::Container,
              current_step: 1,
              current_user: current_user

          else
            flash.failure = "Une erreur est survenue lors de la création de l'événement"
            redirect to: Events::Wizard::New.with(current_step: 1)
          end
        end
      end
    end
end
