require "../../spec_helper"

describe Events::ExportCalendar do
  it "exports calendar for organizer" do
    setup = create_upcoming_event(7)

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ExportCalendar.with(setup[:event].id)
    )

    response.status.should eq(200)
    response.headers["Content-Type"].should contain("text/calendar")
    response.headers["Content-Disposition"].should contain("attachment")
    response.body.should contain("BEGIN:VCALENDAR")
  end

  it "exports calendar for confirmed guest" do
    setup = create_upcoming_event(5)
    guest_user = UserFactory.create
    GuestFactory.create &.event_id(setup[:event].id)
      .user_id(guest_user.id)
      .status(Guest::Status::Confirmed)

    response = ApiClient.auth(guest_user).exec(
      Events::ExportCalendar.with(setup[:event].id)
    )

    response.status.should eq(200)
    response.headers["Content-Type"].should contain("text/calendar")
  end

  it "denies access to non-invited users" do
    setup = create_upcoming_event(7)
    other_user = UserFactory.create

    response = ApiClient.auth(other_user).exec(
      Events::ExportCalendar.with(setup[:event].id)
    )

    response.status.should eq(302)
  end

  it "redirects when event has no start date" do
    setup = create_event_with_organizer

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ExportCalendar.with(setup[:event].id)
    )

    response.status.should eq(302)
  end

  it "includes .ics filename in Content-Disposition" do
    setup = create_upcoming_event(3)

    response = ApiClient.auth(setup[:organizer]).exec(
      Events::ExportCalendar.with(setup[:event].id)
    )

    response.headers["Content-Disposition"].should contain(".ics")
  end
end
