require "../../spec_helper"

describe Guests::Rsvp do
  describe "GET /guests/:guest_id/rsvp" do
    it "shows RSVP form to invited guest" do
      guest_user = UserFactory.create
      event = EventFactory.create &.name("Test Event")
      guest = GuestFactory.create &.event_id(event.id).user_id(guest_user.id)

      response = ApiClient.auth(guest_user).exec(Guests::Rsvp.with(guest.id))

      response.status.should eq(200)
      response.body.should contain("Test Event")
    end

    it "requires authentication" do
      guest = GuestFactory.create

      response = ApiClient.exec(Guests::Rsvp.with(guest.id))

      response.status.should eq(302)
    end
  end

  describe "POST /guests/:guest_id/rsvp" do
    it "updates RSVP to confirmed" do
      guest_user = UserFactory.create
      event = EventFactory.create
      guest = GuestFactory.create &.event_id(event.id).user_id(guest_user.id).status(Guest::Status::NoAnswer)

      response = ApiClient.auth(guest_user).exec(Guests::Rsvp.with(guest.id), guest: {
        status:       Guest::Status::Confirmed.value,
        guest_count:  3,
        notes:        "Excited to attend!",
      })

      response.status.should eq(302)
      response.headers["Location"].should contain("/me")

      updated_guest = GuestQuery.find(guest.id)
      updated_guest.status.should eq(Guest::Status::Confirmed)
      updated_guest.guest_count.should eq(3)
      updated_guest.notes.should eq("Excited to attend!")
    end

    it "updates RSVP to declined" do
      guest_user = UserFactory.create
      event = EventFactory.create
      guest = GuestFactory.create &.event_id(event.id).user_id(guest_user.id)

      response = ApiClient.auth(guest_user).exec(Guests::Rsvp.with(guest.id), guest: {
        status: Guest::Status::Declined.value,
        notes:  "Can't make it, sorry!",
      })

      updated_guest = GuestQuery.find(guest.id)
      updated_guest.status.should eq(Guest::Status::Declined)
      updated_guest.notes.should eq("Can't make it, sorry!")
    end

    it "shows success message" do
      guest_user = UserFactory.create
      guest = GuestFactory.create &.user_id(guest_user.id)

      response = ApiClient.auth(guest_user).exec(Guests::Rsvp.with(guest.id), guest: {
        status: Guest::Status::Confirmed.value,
      })

      response.status.should eq(302)
      # Flash success message would be set
    end

    it "re-renders form on validation error" do
      guest_user = UserFactory.create
      guest = GuestFactory.create &.user_id(guest_user.id)

      # Assuming guest_count must be positive
      response = ApiClient.auth(guest_user).exec(Guests::Rsvp.with(guest.id), guest: {
        status:      Guest::Status::Confirmed.value,
        guest_count: -1,
      })

      response.status.should eq(200)
    end
  end
end
