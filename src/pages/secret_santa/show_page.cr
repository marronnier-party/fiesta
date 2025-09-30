class SecretSanta::ShowPage < MainLayout
  needs event : Event
  needs secret_santa : ::SecretSanta
  needs assignments : Array(SecretSantaAssignment)
  needs my_assignment : SecretSantaAssignment?
  needs guests : Array(Guest)
  needs is_organizer : Bool

  def page_title
    r("secret_santa.title").t + " - " + event.name
  end

  def content
    div class: "max-w-6xl mx-auto px-4 py-8" do
      div class: "mb-6" do
        link r("actions.back").t + " " + event.name, to: Events::Show.with(event.id), class: "btn btn-ghost btn-sm"
      end

      div class: "grid grid-cols-1 lg:grid-cols-3 gap-6" do
        div class: "lg:col-span-2 space-y-6" do
          render_secret_santa_header
          render_my_assignment if my_assignment && !is_organizer?
          render_all_assignments if is_organizer?
        end

        div class: "space-y-6" do
          render_settings
          render_participants
        end
      end
    end
  end

  private def render_secret_santa_header
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center justify-between" do
          h1 r("secret_santa.title").t, class: "card-title text-3xl"
          span "🎅", class: "text-4xl"
        end

        if budget = secret_santa.gift_budget
          para r("secret_santa.gift_budget").t + ": $#{"%.2f" % budget}", class: "text-lg text-base-content/70 mt-2"
        end

        if rules = secret_santa.rules
          div class: "mt-4" do
            h3 r("secret_santa.rules").t + ":", class: "font-semibold mb-2"
            para rules, class: "text-base-content/80 whitespace-pre-wrap"
          end
        end
      end
    end
  end

  private def render_my_assignment
    return unless assignment = my_assignment

    div class: "card bg-gradient-to-br from-red-100 to-green-100 dark:from-red-900 dark:to-green-900 shadow-xl" do
      div class: "card-body" do
        h2 r("secret_santa.your_assignment").t, class: "card-title text-2xl mb-4"

        div class: "text-center py-8" do
          div class: "avatar placeholder mb-4" do
            div class: "bg-neutral text-neutral-content rounded-full w-24" do
              span class: "text-3xl" do
                text assignment.receiver!.user!.name[0..0].upcase
              end
            end
          end

          h3 assignment.receiver!.user!.name, class: "text-2xl font-bold mb-4"

          div class: "flex gap-2 justify-center mt-6" do
            case assignment.status
            when SecretSantaAssignment::Status::Pending
              form_for ::SecretSanta::UpdateStatus.with(assignment.id), class: "inline" do
                input type: "hidden", name: "status", value: "purchased"
                button r("secret_santa.mark_purchased").t, class: "btn btn-primary"
              end
            when SecretSantaAssignment::Status::Purchased
              span r("secret_santa.status.purchased").t + " ✓", class: "badge badge-success badge-lg"
              form_for ::SecretSanta::UpdateStatus.with(assignment.id), class: "inline" do
                input type: "hidden", name: "status", value: "given"
                button r("secret_santa.mark_given").t, class: "btn btn-primary"
              end
            when SecretSantaAssignment::Status::Given
              span r("secret_santa.status.given").t + " 🎁", class: "badge badge-success badge-lg"
            end
          end
        end
      end
    end
  end

  private def render_all_assignments
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        div class: "flex items-center justify-between mb-4" do
          h2 r("secret_santa.assignments").t, class: "card-title text-2xl"

          form_for ::SecretSanta::Randomize.with(event.id), class: "inline" do
            button r("secret_santa.randomize").t,
                   class: "btn btn-primary",
                   data_confirm: "Cela supprimera les attributions existantes. Continuer ?"
          end
        end

        if assignments.empty?
          div class: "text-center py-8 text-base-content/60" do
            icon "gift", "w-12 h-12 mx-auto mb-2 opacity-40"
            para "Aucune attribution pour le moment"
            para "Cliquez sur 'Tirer au sort' pour créer les attributions", class: "text-sm"
          end
        else
          div class: "space-y-2" do
            assignments.each do |assignment|
              render_assignment_row(assignment)
            end
          end
        end
      end
    end
  end

  private def render_assignment_row(assignment : SecretSantaAssignment)
    div class: "flex items-center justify-between p-3 bg-base-200 rounded-lg" do
      div class: "flex items-center gap-3" do
        div class: "avatar placeholder" do
          div class: "bg-neutral text-neutral-content rounded-full w-10" do
            span class: "text-xs" do
              text assignment.giver!.user!.name[0..0].upcase
            end
          end
        end

        div do
          span assignment.giver!.user!.name, class: "font-semibold"
          text " → "
          span assignment.receiver!.user!.name, class: "font-semibold"
        end
      end

      case assignment.status
      when SecretSantaAssignment::Status::Pending
        span r("secret_santa.status.pending").t, class: "badge badge-warning"
      when SecretSantaAssignment::Status::Purchased
        span r("secret_santa.status.purchased").t, class: "badge badge-info"
      when SecretSantaAssignment::Status::Given
        span r("secret_santa.status.given").t, class: "badge badge-success"
      end
    end
  end

  private def render_settings
    return unless is_organizer?

    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 "Paramètres", class: "card-title mb-4"

        div class: "form-control" do
          label r("secret_santa.gift_budget").t, class: "label"
          para "$#{"%.2f" % (secret_santa.gift_budget || 0.0)}", class: "text-lg"
        end

        if reveal_date = secret_santa.reveal_date
          div class: "form-control mt-4" do
            label r("secret_santa.reveal_date").t, class: "label"
            para reveal_date.to_s("%d %B %Y"), class: "text-lg"
          end
        end
      end
    end
  end

  private def render_participants
    div class: "card bg-base-100 shadow-xl" do
      div class: "card-body" do
        h2 "Participants", class: "card-title mb-4"
        para "#{guests.size} " + (guests.size > 1 ? "invités confirmés" : "invité confirmé"), class: "text-base-content/70 mb-4"

        div class: "space-y-2" do
          guests.each do |guest|
            div class: "flex items-center gap-3 p-2" do
              div class: "avatar placeholder" do
                div class: "bg-neutral text-neutral-content rounded-full w-8" do
                  span class: "text-xs" do
                    text guest.user!.name[0..0].upcase
                  end
                end
              end
              span guest.user!.name, class: "text-sm"
            end
          end
        end
      end
    end
  end
end
