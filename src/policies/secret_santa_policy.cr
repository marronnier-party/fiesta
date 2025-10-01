class SecretSantaPolicy < ApplicationPolicy(SecretSanta)
  include Policies::Concerns::EventRelatedAuthorizationHelpers

  def show?
    # Users can view Secret Santa if they are organizer or a confirmed guest
    organizer? || confirmed_guest?
  end

  def enable?
    organizer?
  end

  def randomize?
    organizer?
  end

  def toggle_lock?
    organizer?
  end
end
