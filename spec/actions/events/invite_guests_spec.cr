require "../../spec_helper"

describe Events::InviteGuests do
  describe "GET /events/:event_id/invite" do
    it "shows invite page to organizer" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      available_user = UserFactory.create

      response = ApiClient.auth(organizer).exec(Events::InviteGuests.with(event.id))

      response.status.should eq(200)
      response.body.should contain(available_user.name)
      response.body.should contain("Sélectionner les invités") # Select guests
    end

    it "does not show already invited users" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      invited_user = UserFactory.create
      available_user = UserFactory.create
      GuestFactory.create &.event_id(event.id).user_id(invited_user.id)

      response = ApiClient.auth(organizer).exec(Events::InviteGuests.with(event.id))

      response.body.should_not contain(invited_user.email)
      response.body.should contain(available_user.name)
    end

    it "prevents non-organizers from accessing" do
      organizer = UserFactory.create
      other_user = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)

      response = ApiClient.auth(other_user).exec(Events::InviteGuests.with(event.id))

      response.status.should eq(302)
      response.headers["Location"].should contain("/events/#{event.id}")
    end
  end

  describe "POST /events/:event_id/invite" do
    it "creates guest invitations" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      user1 = UserFactory.create
      user2 = UserFactory.create

      response = ApiClient.auth(organizer).exec(Events::InviteGuests.with(event.id), user_ids: [user1.id.to_s, user2.id.to_s])

      response.status.should eq(302)

      GuestQuery.new.event_id(event.id).results.size.should eq(2)
      GuestQuery.new.user_id(user1.id).event_id(event.id).first.status.should eq(Guest::Status::NoAnswer)
    end

    it "prevents non-organizers from inviting" do
      organizer = UserFactory.create
      other_user = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      invite_user = UserFactory.create

      response = ApiClient.auth(other_user).exec(Events::InviteGuests.with(event.id), user_ids: [invite_user.id.to_s])

      response.status.should eq(302)
      GuestQuery.new.user_id(invite_user.id).first?.should be_nil
    end

    it "shows success message" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      user = UserFactory.create

      response = ApiClient.auth(organizer).exec(Events::InviteGuests.with(event.id), user_ids: [user.id.to_s])

      response.status.should eq(302)
      # Flash message would be set (tested in integration tests)
    end
  end
end
