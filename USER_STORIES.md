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
- Add family members: spouse, kids (name, age, relationship, dietary restrictions)
- Click "+ Add family member" for each
- Submit RSVP
- See confirmation message
- Return to dashboard (invitation moves to confirmed events)

**Status:** ❌ TO IMPLEMENT

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

**Status:** ❌ TO IMPLEMENT

---

### 6. Change RSVP
**As a** guest
**I want to** change my RSVP
**So that** I can update my attendance status if plans change

**Flow:**
- View confirmed event
- Click "Change RSVP"
- Update status or family members
- Save changes

**Status:** ❌ TO IMPLEMENT

---

### 7. View Event Details
**As a** guest
**I want to** see full event details
**So that** I know when, where, and what to expect

**Flow:**
- Click "View Details" from event card
- See: date, time, location, description, organizer
- See: who's coming (guest list with family members)
- See: all tasks (what everyone's bringing)
- See: my RSVP status and my tasks

**Status:** ❌ TO IMPLEMENT (Events::Show needs guest view)

---

### 8. View My Tasks
**As a** guest
**I want to** see all my assigned tasks
**So that** I know what I'm responsible for

**Flow:**
- Click "My Tasks" in navbar OR see on dashboard
- See tasks grouped by event
- See status of each task
- Quick actions to update status

**Status:** ⚠️ Partially implemented (dashboard shows tasks, need dedicated page)

---

### 9. Mark Task In Progress
**As a** guest
**I want to** mark a task as "in progress"
**So that** others know I'm working on it

**Flow:**
- View task
- Click "Start Task" button
- Task status changes to "In Progress"

**Status:** ❌ TO IMPLEMENT

---

### 10. Complete Task with Cost
**As a** guest
**I want to** mark task complete and report cost
**So that** we can track expenses

**Flow:**
- View in-progress task
- Click "Mark Complete"
- Enter amount spent (optional)
- Add notes (optional)
- Submit
- Task marked complete with timestamp

**Status:** ❌ TO IMPLEMENT

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

**Status:** ❌ TO IMPLEMENT (Events::New)

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

**Status:** ❌ TO IMPLEMENT

---

### 13. Create New Location
**As an** organizer
**I want to** create a new location
**So that** I can use it for events

**Flow:**
- Click "Create Location" in event form OR navbar
- Fill in: name, address, city, postal code, country
- Add optional description
- Save
- Location available for future events

**Status:** ❌ TO IMPLEMENT (Locations::New)

---

### 14. Invite Guests to Event
**As an** organizer
**I want to** invite family members
**So that** they receive notifications and can RSVP

**Flow:**
- View event page
- Click "Invite Guests"
- Search/select family members by email
- Or invite new people by email
- Click "Send Invitations"
- Guests receive email with RSVP link

**Status:** ❌ TO IMPLEMENT

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
- Assign to guest (dropdown)
- Add notes (optional)
- Save task
- Guest sees it on their dashboard

**Status:** ❌ TO IMPLEMENT

---

### 16. View Event Guest List
**As an** organizer
**I want to** see who's coming
**So that** I can plan accordingly

**Flow:**
- View event page
- See "Guest List" section
- See confirmed: names + family member count
- See pending: who hasn't responded
- See declined: who can't come
- See total headcount

**Status:** ❌ TO IMPLEMENT

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
- See total costs reported

**Status:** ❌ TO IMPLEMENT

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
- Optionally notify guests of changes

**Status:** ⚠️ Partially implemented (Events::Edit exists)

---

### 19. Cancel Event
**As an** organizer
**I want to** cancel an event
**So that** guests know it's not happening

**Flow:**
- View event
- Click "Cancel Event"
- Confirm cancellation
- Optionally add reason
- All guests notified
- Event marked as cancelled

**Status:** ❌ TO IMPLEMENT

---

### 20. View My Events (Organizer)
**As an** organizer
**I want to** see all events I've created
**So that** I can manage them

**Flow:**
- Click "My Events" in navbar
- See list of events (upcoming, past, drafts)
- Filter by status
- Quick stats: guests confirmed, tasks pending

**Status:** ❌ TO IMPLEMENT (Events::Index)

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

## 📊 Implementation Priority

### CRITICAL (Week 1)
- ✅ Dashboard view
- ❌ RSVP flow (stories 4, 5, 6)
- ❌ Event details page (story 7)
- ❌ Task completion (stories 9, 10)

### HIGH (Week 2)
- ❌ Create event (story 11)
- ❌ Invite guests (story 14)
- ❌ Assign tasks (story 15)
- ❌ View event guest list (story 16)

### MEDIUM (Week 3)
- ❌ Location management (stories 12, 13)
- ❌ My Events page (story 20)
- ❌ Edit event (story 18)
- ❌ View task status (story 17)

### LOW (Week 4)
- ❌ Profile management (stories 22, 23)
- ❌ Cancel event (story 19)

---

## 🎨 UI/UX Notes

- **Mobile-first**: All flows must work on phones
- **Minimize clicks**: Uncle Bob should RSVP in 2-3 clicks
- **Clear CTAs**: Big, obvious buttons for primary actions
- **Empty states**: Friendly messages when no data
- **Loading states**: Spinners for async actions
- **Confirmations**: Ask before destructive actions
- **Success messages**: Clear feedback after actions
