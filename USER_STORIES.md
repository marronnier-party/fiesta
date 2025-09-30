# Fiesta User Stories & Flows

## Overview
This document maps out 20+ user stories for the Fiesta family event organizer app, covering both guest and organizer perspectives.

---

## 👥 Guest User Stories (Primary Users - 90% of traffic)

### 1. First-Time Guest Sign Up
**As a** family member receiving an invitation
**I want to** create an account
**So that** I can RSVP to family events

**Flow:**
- Click "Join Your Family" from landing page
- Fill in name, email, password
- Receive welcome email
- Redirected to dashboard

**Status:** ✅ Implemented (SignUps::New)

---

### 2. Guest Sign In
**As a** returning guest
**I want to** sign in
**So that** I can check my invitations and tasks

**Flow:**
- Click "Sign In" from landing page or navbar
- Enter email and password
- Redirected to dashboard

**Status:** ✅ Implemented (SignIns::New)

---

### 3. View Dashboard
**As a** guest
**I want to** see my dashboard
**So that** I can quickly see pending invitations, confirmed events, and tasks

**Flow:**
- Sign in
- See pending invitations at top (if any)
- See confirmed events below
- See my assigned tasks
- See empty states if no data

**Status:** ✅ Implemented (Me::Show)

---

### 4. RSVP to Event - Accept with Family
**As a** guest
**I want to** RSVP "yes" and add my family members
**So that** the organizer knows who's coming

**Flow:**
- Click "RSVP Now" from invitation card
- Select "I'm coming!"
- Add guest count and optional notes
- Submit RSVP
- See confirmation message
- Return to dashboard (invitation moves to confirmed events)

**Status:** ✅ Implemented (Guests::Rsvp) - with comprehensive specs

---

### 5. RSVP to Event - Decline
**As a** guest
**I want to** RSVP "no"
**So that** the organizer knows I can't attend

**Flow:**
- Click "RSVP Now" from invitation card
- Select "I can't make it"
- Optionally add note explaining why
- Submit
- Invitation removed from dashboard

**Status:** ✅ Implemented (Guests::Rsvp) - with comprehensive specs

---

### 6. Change RSVP
**As a** guest
**I want to** change my RSVP
**So that** I can update my attendance status if plans change

**Flow:**
- View confirmed event
- Click "Change RSVP"
- Update status or guest count
- Save changes

**Status:** ✅ Implemented (Guests::Rsvp allows re-submission) - with comprehensive specs

---

### 7. View Event Details
**As a** guest
**I want to** see full event details
**So that** I know when, where, and what to expect

**Flow:**
- Click "View Details" from event card
- See: date, time, location, description, organizer
- See: who's coming (guest list with counts)
- See: all tasks (what everyone's bringing)
- See: my RSVP status and RSVP button

**Status:** ✅ Implemented (Events::Show) - with comprehensive specs for both guest and organizer views

---

### 8. View My Tasks
**As a** guest
**I want to** see all my assigned tasks
**So that** I know what I'm responsible for

**Flow:**
- See tasks on dashboard
- See tasks on event details page
- See status of each task
- Quick actions to complete tasks

**Status:** ✅ Implemented (Me::Show dashboard + Events::Show) - tasks visible throughout UI

---

### 9. Mark Task In Progress
**As a** guest
**I want to** mark a task as "in progress"
**So that** others know I'm working on it

**Flow:**
- View task
- Click "Start Task" button
- Task status changes to "In Progress"

**Status:** ✅ Implemented (Tasks::Start) - with button in Events::Show page

---

### 10. Complete Task with Cost
**As a** guest
**I want to** mark task complete and report cost
**So that** we can track expenses

**Flow:**
- View task
- Click "Mark Complete"
- Enter amount spent (optional)
- Add notes (optional)
- Submit
- Task marked complete with timestamp

**Status:** ✅ Implemented (Tasks::Complete) - with comprehensive specs

---

## 👨‍💼 Organizer User Stories (10% of users, high importance)

### 11. Create New Event
**As an** organizer
**I want to** create a new event
**So that** I can invite family members

**Flow:**
- Click "Create Event" in navbar
- Fill in: name, description, date/time, location
- Save draft or publish
- Redirected to event page

**Status:** ✅ Implemented (Events::New, Events::Create) - with comprehensive specs

---

### 12. Choose Existing Location
**As an** organizer
**I want to** select from saved locations
**So that** I don't have to re-enter addresses

**Flow:**
- During event creation
- Click "Choose Location" dropdown
- See list of saved locations (Grandma's House, etc.)
- Select one
- Location details auto-filled

**Status:** ✅ Implemented (Events::New includes location dropdown)

---

### 13. Create New Location
**As an** organizer
**I want to** create a new location
**So that** I can use it for events

**Flow:**
- Click "Create Location" in navbar
- Fill in: name, address, city, postal code, country
- Add optional description
- Save
- Location available for future events

**Status:** ✅ Implemented (Locations::New, Locations::Create)

---

### 14. Invite Guests to Event
**As an** organizer
**I want to** invite family members
**So that** they can RSVP

**Flow:**
- View event page
- Click "Invite Guests"
- Select family members with checkboxes
- Click "Send Invitations"
- Guests created with NoAnswer status

**Status:** ✅ Implemented (Events::InviteGuests) - with comprehensive specs

---

### 15. Assign Tasks to Guests
**As an** organizer
**I want to** assign tasks
**So that** responsibilities are clear

**Flow:**
- View event page
- Click "Add Task"
- Enter task name (e.g., "Bring desserts")
- Select category (Food, Beverages, Setup, etc.)
- Assign to confirmed guest (dropdown)
- Save task
- Guest sees it on their dashboard

**Status:** ✅ Implemented (Events::AddTask) - with comprehensive specs

---

### 16. View Event Guest List
**As an** organizer
**I want to** see who's coming
**So that** I can plan accordingly

**Flow:**
- View event page
- See "Guest List" section
- See confirmed: names + guest count
- See pending: who hasn't responded
- See declined: who can't come
- See total headcount with statistics

**Status:** ✅ Implemented (Events::Show includes comprehensive guest list) - with specs

---

### 17. View Event Task Status
**As an** organizer
**I want to** see task completion
**So that** I know what's covered

**Flow:**
- View event page
- See "Tasks" section
- See: pending, in-progress, completed
- See who's assigned to what
- See task details and status

**Status:** ✅ Implemented (Events::Show includes comprehensive task list) - with specs

---

### 18. Edit Event Details
**As an** organizer
**I want to** update event information
**So that** guests see accurate details

**Flow:**
- View event page
- Click "Edit Event"
- Update fields
- Save changes
- See confirmation message

**Status:** ✅ Implemented (Events::Edit, Events::Update) - full form with all fields

---

### 19. Cancel Event
**As an** organizer
**I want to** cancel an event
**So that** guests know it's not happening

**Flow:**
- View event
- Click "Cancel Event"
- Confirm cancellation
- Event marked as cancelled
- Status badge updated

**Status:** ✅ Implemented (Events::Cancel) - with button in Events::Show page

---

### 20. View My Events (Organizer)
**As an** organizer
**I want to** see all events I've created
**So that** I can manage them

**Flow:**
- Click "My Events" in navbar
- See list of events (upcoming, past, drafts)
- See guest and task counts
- Click to view details

**Status:** ✅ Implemented (Events::Index) - with comprehensive specs

---

## 🔒 Additional User Stories

### 21. Sign Out
**As any** user
**I want to** sign out
**So that** my account is secure

**Flow:**
- Click profile dropdown
- Click "Sign Out"
- Session cleared
- Redirected to landing page

**Status:** ✅ Implemented

---

### 22. View Profile
**As any** user
**I want to** view my profile
**So that** I can see my account details

**Flow:**
- Click profile dropdown
- Click "Profile"
- See: name, email, events I'm invited to

**Status:** ❌ TO IMPLEMENT

---

### 23. Update Profile
**As any** user
**I want to** update my profile
**So that** my information is current

**Flow:**
- View profile
- Click "Edit"
- Update name, email, password
- Save

**Status:** ❌ TO IMPLEMENT

---

### 24. Reassign Task
**As an** organizer
**I want to** reassign a task to a different guest
**So that** I can adjust responsibilities

**Flow:**
- View event page
- Click task options
- Click "Reassign"
- Select new guest
- Save changes
- Both guests notified

**Status:** ❌ TO IMPLEMENT

---

### 25. Delete Task
**As an** organizer
**I want to** delete a task
**So that** I can remove tasks that are no longer needed

**Flow:**
- View event page
- Click delete icon on task
- Confirm deletion
- Task removed

**Status:** ✅ Implemented (Tasks::Delete) - with delete button for organizers in Events::Show page

---

### 26. Add Dietary Restrictions to RSVP
**As a** guest
**I want to** specify dietary restrictions
**So that** the organizer can plan food accordingly

**Flow:**
- RSVP to event
- Add dietary restrictions field
- Save RSVP
- Organizer can view all restrictions

**Status:** ❌ TO IMPLEMENT

---

### 27. View All Dietary Restrictions
**As an** organizer
**I want to** see all guests' dietary restrictions
**So that** I can plan food appropriately

**Flow:**
- View event page
- See dietary restrictions section
- See list of all restrictions by guest
- Export list for caterer

**Status:** ❌ TO IMPLEMENT

---

### 28. Duplicate Event
**As an** organizer
**I want to** duplicate a previous event
**So that** I can quickly create similar events

**Flow:**
- View past event
- Click "Duplicate Event"
- Event details pre-filled
- Update date and details
- Save new event

**Status:** ❌ TO IMPLEMENT

---

### 29. Event Activity Feed
**As an** organizer or guest
**I want to** see recent activity on an event
**So that** I stay updated on changes

**Flow:**
- View event page
- See activity feed
- Shows: RSVPs, task completions, new guests
- Timestamps for each activity

**Status:** ❌ TO IMPLEMENT

---

### 30. Send Reminder to Pending Guests
**As an** organizer
**I want to** remind guests who haven't RSVP'd
**So that** I can get final headcount

**Flow:**
- View event page
- See pending guests count
- Click "Send Reminder"
- Select guests to remind
- Reminder email sent

**Status:** ❌ TO IMPLEMENT

---

### 31. Add Notes to Event
**As an** organizer
**I want to** add private organizer notes
**So that** I can track planning details

**Flow:**
- View event page
- See "Organizer Notes" section
- Add/edit notes
- Notes only visible to organizer
- Save notes

**Status:** ❌ TO IMPLEMENT

---

### 32. Budget Tracking
**As an** organizer
**I want to** track event budget vs actual costs
**So that** I can manage expenses

**Flow:**
- View event page
- See budget section
- Set overall budget
- See actual costs from completed tasks
- See remaining budget

**Status:** ❌ TO IMPLEMENT

---

### 33. Mark Event as Attended
**As an** organizer
**I want to** mark which guests actually attended
**So that** I have accurate attendance records

**Flow:**
- After event
- View guest list
- Mark guests as "Attended"
- Save attendance
- View attendance history

**Status:** ❌ TO IMPLEMENT

---

### 34. Export Guest List
**As an** organizer
**I want to** export guest list to CSV
**So that** I can use it in other tools

**Flow:**
- View event page
- Click "Export Guests"
- Choose format (CSV/PDF)
- Download file with names, emails, counts

**Status:** ❌ TO IMPLEMENT

---

### 35. Search Events
**As any** user
**I want to** search my events
**So that** I can quickly find specific events

**Flow:**
- Dashboard or My Events page
- Enter search term
- See filtered results
- Search by name, date, location

**Status:** ❌ TO IMPLEMENT

---

### 36. Filter Tasks by Status
**As a** guest
**I want to** filter my tasks by status
**So that** I can focus on what needs doing

**Flow:**
- View My Tasks page
- Click filter buttons
- Show only: Pending/In Progress/Completed
- See filtered list

**Status:** ❌ TO IMPLEMENT

---

### 37. Task Comments
**As** organizer or assigned guest
**I want to** comment on tasks
**So that** we can coordinate details

**Flow:**
- View task details
- See comments section
- Add comment
- Other party notified
- Thread of comments visible

**Status:** ❌ TO IMPLEMENT

---

### 38. Location Search
**As an** organizer
**I want to** search locations when creating events
**So that** I can quickly find the right venue

**Flow:**
- Creating/editing event
- Location dropdown has search
- Type to filter locations
- See matching results
- Select location

**Status:** ❌ TO IMPLEMENT

---

### 39. Manage My Locations
**As an** organizer
**I want to** view and edit my saved locations
**So that** I can keep location info current

**Flow:**
- Click "My Locations" in nav
- See list of locations I created
- Click Edit to modify details
- Click Delete to remove locations
- Empty state with create button

**Status:** ✅ Implemented (Locations::Index with IndexPage) - full CRUD with nav link

---

### 40. Event Date Change Notification
**As a** guest
**I want to** be notified when event date changes
**So that** I don't miss the updated date

**Flow:**
- Organizer changes event date
- All confirmed guests receive notification
- Email and in-app notification
- Clear indication of date change

**Status:** ❌ TO IMPLEMENT

---

## 📊 Implementation Status Summary

### ✅ COMPLETED (24/40 stories = 60%)
- **Guest Stories:** Dashboard (3), RSVP flows (4-6), Event details (7), View tasks (8), Mark in progress (9), Complete task (10)
- **Organizer Stories:** Create event (11), Choose location (12), Create location (13), Invite guests (14), Assign tasks (15), View guest list (16), View task status (17), Edit event (18), Cancel event (19), My Events (20), Delete tasks (25), Manage locations (39)
- **Auth Stories:** Sign up (1), Sign in (2), Sign out (21)

### ❌ TO IMPLEMENT (16 stories)
- **Core Features:** Profile management (22-23), Reassign task (24)
- **Enhanced Features:** Dietary restrictions (26-27), Event duplication (28), Activity feed (29)
- **Communication:** RSVP reminders (30), Event date notifications (40)
- **Organization:** Organizer notes (31), Budget tracking (32), Attendance tracking (33)
- **Data Management:** Export guests (34), Search events (35), Filter tasks (36)
- **Collaboration:** Task comments (37), Location search (38)

### 📋 Test Coverage
- 90+ comprehensive specs covering:
  - All major actions (Events, Guests, Tasks)
  - All query objects (EventQuery, GuestQuery, TaskQuery)
  - Authentication and authorization
  - Validation and edge cases

### 🌐 Localization
- Complete French/English translations (120+ keys each)
- French as default locale using Rosetta
- All UI strings translated

---

## 🎨 UI/UX Notes

- **Mobile-first**: All flows must work on phones
- **Minimize clicks**: Uncle Bob should RSVP in 2-3 clicks
- **Clear CTAs**: Big, obvious buttons for primary actions
- **Empty states**: Friendly messages when no data
- **Loading states**: Spinners for async actions
- **Confirmations**: Ask before destructive actions
- **Success messages**: Clear feedback after actions
