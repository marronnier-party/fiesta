# Fiesta UI/UX Completion Plan (Revised for Family Use)

## Executive Summary

This plan outlines the complete implementation of all user flows, pages, and components needed to transform Fiesta from showing the Lucky vanilla welcome page into a fully functional family event organizer.

**Current State**:
- Database models and operations are complete and tested
- Authorization mixins are in place
- Wizard flows were disabled and moved to `/tmp/fiesta_wizard_backup/`
- Home page shows Lucky welcome page for guests
- Signed-in users see a basic profile page
- MainLayout has mockup code but no real implementation

**Target State**: A simple, focused family event app where **most users are guests** who:
- Sign in once or twice a year
- RSVP to family events (with number of people coming)
- View assigned tasks
- Report expenses/costs for tasks they completed

**Key Insight**: This is NOT a power-user event management platform. It's a lightweight family coordination tool where:
- 1-2 family members organize events
- 10-20+ family members attend events
- Most activity is RSVP and task reporting, not event creation

---

## 1. User Personas & Primary Flows

### Persona 1: Event Organizer (1-2 users)
**"Marie, the family matriarch"**
- Creates 2-3 major family events per year (reunion, holiday dinner, birthday)
- Invites extended family
- Assigns tasks (who brings dessert, who decorates, etc.)
- Tracks RSVPs and expenses

**Primary flows**:
1. Create event
2. Invite family members
3. Track RSVPs
4. Assign tasks
5. Review expenses

### Persona 2: Family Guest (10-20+ users)
**"Uncle Bob, who checks in twice a year"**
- Receives email invitation to family event
- Opens link, signs in (or creates account)
- RSVPs: Confirms + indicates number of guests (him + spouse + 2 kids = 4 people)
- Views assigned tasks ("Bring wine")
- Reports when task is done and cost ($45 for wine)
- Signs out, comes back day-of-event for updates

**Primary flows**:
1. Receive invitation email → Sign in
2. RSVP to event (number of people)
3. View my tasks
4. Mark task complete + report cost
5. See event details (date, time, location, what to bring)

---

## 2. Core User Flows (Revised)

### 2.1 Landing & Authentication
**Priority**: HIGH

**2.1.1 Landing Page (Unauthenticated)**
- **File**: `src/pages/home/index_page.cr` (new)
- **Action**: `src/actions/home/index.cr` ✓
- **Requirements**:
  - **Simple, warm family-focused design**
  - Hero: "Coordinate Family Events Together"
  - Sub-text: "RSVP to gatherings, track who's bringing what, and stay connected"
  - Two buttons: "Sign In" | "Join Your Family"
  - No complex marketing copy - this is for invited family members

**2.1.2 Sign In/Sign Up**
- Already complete ✓
- Minor enhancement: After sign-up, redirect to "waiting for invitation" page if no events yet

---

### 2.2 Family Guest Dashboard (PRIMARY EXPERIENCE)
**Priority**: CRITICAL - **This is what 90% of users see**

**2.2.1 Dashboard for Guests (`Me::Show`)**
- **File**: `src/pages/me/show_page.cr` (rewrite)
- **Action**: `src/actions/me/show.cr` ✓

**Layout for Guest Users**:

```
┌─────────────────────────────────────────┐
│ Welcome back, Uncle Bob! 👋              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🎉 You're Invited!                      │
│                                          │
│ ┌─────────────────────────────────┐    │
│ │ Smith Family Reunion 2025       │    │
│ │ July 4th, 2025 • 2:00 PM       │    │
│ │ 📍 Grandma's House              │    │
│ │                                  │    │
│ │ ⚠️  Please RSVP                  │    │
│ │ [RSVP Now] [View Details]       │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✓ Upcoming Events You've Confirmed      │
│                                          │
│ ┌─────────────────────────────────┐    │
│ │ Holiday Dinner 2025             │    │
│ │ Dec 24th • 6:00 PM              │    │
│ │ You + 3 guests confirmed        │    │
│ │                                  │    │
│ │ Your tasks:                      │    │
│ │ • Bring wine ($45 reported) ✓   │    │
│ │ • Setup tables (pending)        │    │
│ │                                  │    │
│ │ [View Event]                     │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📋 Your Tasks                           │
│                                          │
│ • Setup tables (Dec 24 event)           │
│   [Mark Complete] [Report Cost]         │
│                                          │
│ • Bring appetizers (July 4 event)       │
│   [Mark Complete] [Report Cost]         │
└─────────────────────────────────────────┘
```

**Requirements**:
1. **Pending Invitations Section** (if any):
   - Show events user is invited to but hasn't RSVP'd
   - Prominent RSVP button
   - Event details preview

2. **Confirmed Events Section**:
   - Events user has confirmed attendance
   - Show: name, date, time, location
   - Show: number of guests user RSVP'd with
   - Show: user's assigned tasks (status + cost if reported)
   - Quick "View Event" link

3. **My Tasks Section**:
   - All tasks assigned to user across all events
   - Quick actions: Mark complete, Report cost
   - Group by event

4. **Past Events** (collapsed by default):
   - Show previous events attended

5. **Empty States**:
   - If no invitations: "No upcoming events yet. You'll see invitations here when family members add you to events."
   - If no tasks: "No tasks assigned yet."

**Components to create**:
- `Dashboard::InvitationCard` - Pending RSVP card
- `Dashboard::ConfirmedEventCard` - Confirmed event summary
- `Dashboard::TaskListItem` - Task with quick actions
- `Dashboard::EmptyState` - No invitations/tasks message

---

### 2.3 RSVP Flow (PRIMARY USER INTERACTION)
**Priority**: CRITICAL

**2.3.1 Quick RSVP from Dashboard**
- **Action**: `src/actions/guests/quick_rsvp.cr` (new)
- **Requirements**:
  - Modal or inline form on dashboard
  - Simple question: "Can you make it to [Event Name]?"
  - Options:
    - ✓ Yes! → Show dependent guests form
    - ✗ Sorry, can't make it
    - ? Maybe / Let me think
  - Optional: Add notes
  - Submit → Update guest status, show confirmation
  - Record `answered_at` timestamp ✓

**2.3.2 Full Event RSVP Page WITH Dependent Guests**
- **File**: `src/pages/guests/rsvp_page.cr` (new)
- **Action**: `src/actions/guests/rsvp.cr` (new)
- **URL**: `/guests/:guest_id/rsvp`
- **Requirements**:
  - **Event details** prominently displayed:
    - Name, date, time
    - Location with map
    - Description
  - **RSVP form**:
    - Status: Confirm / Decline / Maybe
    - **If confirming: Add family members**
      - "Who's coming with you?"
      - Dynamic form to add dependent guests:
        - Name (required)
        - Relationship (spouse, son, daughter, etc.)
        - Age (optional, helpful for kids)
        - Dietary restrictions (optional)
      - [+ Add another person] button
      - Can add multiple dependents
    - Optional notes to organizer
    - Submit button
  - **Success**:
    - Create/update Guest record
    - Create DependentGuest records for each family member
    - Update guest_count automatically
    - Show confirmation message
    - Send confirmation email with all names
    - Redirect to dashboard or event view

**Example RSVP Flow**:
```
Uncle Bob clicks RSVP:

1. Can you attend? → Yes!

2. Who's coming with you?
   ┌─────────────────────────────────┐
   │ You: Bob Smith (already set)    │
   └─────────────────────────────────┘

   [+ Add family member]

   ┌─────────────────────────────────┐
   │ Name: Sarah Smith               │
   │ Relationship: Spouse            │
   │ Age: 35                         │
   │ Dietary: [blank]                │
   └─────────────────────────────────┘

   [+ Add another person]

   ┌─────────────────────────────────┐
   │ Name: Tim Smith                 │
   │ Relationship: Son               │
   │ Age: 12                         │
   │ Dietary: Vegetarian             │
   └─────────────────────────────────┘

   [+ Add another person]

   ┌─────────────────────────────────┐
   │ Name: Emily Smith               │
   │ Relationship: Daughter          │
   │ Age: 8                          │
   │ Dietary: [blank]                │
   └─────────────────────────────────┘

3. Notes: "Looking forward to seeing everyone!"

[Confirm RSVP]

Result:
- Guest status: Confirmed
- Guest count: 4
- Dependent guests: Sarah (spouse, 35), Tim (son, 12, vegetarian), Emily (daughter, 8)
- Organizer sees: "Bob Smith + 3 family members (4 total)"
```

**2.3.3 Email Invitation Flow**
- User receives email: "You're invited to [Event]!"
- Email includes:
  - Event details
  - Direct RSVP link → `/guests/:guest_id/rsvp`
  - Link auto-authenticates or prompts sign in
- After RSVP, user sees their tasks (if any)

---

### 2.4 Event View for Guests
**Priority**: HIGH

**2.4.1 Event Details Page (Guest Perspective)**
- **File**: `src/pages/events/show_page.cr` (enhance with guest view)
- **Action**: `src/actions/events/show.cr` ✓

**Layout for Guests**:
```
┌─────────────────────────────────────────┐
│ Smith Family Reunion 2025 🎉            │
│ Organized by Marie Smith                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📅 When: July 4th, 2025 at 2:00 PM     │
│ 📍 Where: Grandma's House               │
│           123 Oak St, Springfield       │
│           [View Map]                     │
│                                          │
│ 📝 What: Annual family reunion with     │
│          BBQ, games, and catching up!   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Your RSVP: ✓ Confirmed (You + 3 guests)│
│ [Change RSVP]                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Your Tasks                               │
│                                          │
│ • Bring potato salad                    │
│   Status: ⏳ Pending                    │
│   [Mark Complete] [Report Cost]         │
│                                          │
│ • Setup chairs                          │
│   Status: ✓ Complete ($0)              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Who's Coming? (32 people confirmed)     │
│                                          │
│ ✓ Uncle Bob & family (4 people)        │
│ ✓ Aunt Susan & family (3 people)       │
│ ✓ Cousin Mike (1 person)               │
│ ... [Show all]                          │
│                                          │
│ ⏳ Waiting for response from 5 people   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ What Everyone's Bringing                 │
│                                          │
│ • Potato salad - Uncle Bob              │
│ • Desserts - Aunt Susan ($25) ✓        │
│ • Drinks - Cousin Mike ($40) ✓         │
│ • Decorations - Marie ($30) ✓          │
│ ... [Show all]                          │
│                                          │
│ Total expenses: $95                     │
└─────────────────────────────────────────┘
```

**Requirements**:
1. **Event Details** - Clear, readable info
2. **User's RSVP Status** - Highlighted, easy to change
3. **User's Tasks** - Prominent, with quick actions
4. **Guest List** - Who's coming (transparency for family)
5. **All Tasks** - What everyone is bringing (coordination)
6. **Total Expenses** - Running total of reported costs

**Permissions**:
- Guests can only see: details, who's coming, all tasks
- Guests can edit: their own RSVP, their own tasks
- Guests cannot: edit event, invite others, assign tasks

---

### 2.5 Task Management for Guests
**Priority**: HIGH

**2.5.1 Complete Task & Report Cost**
- **Action**: `src/actions/tasks/complete.cr` (new) or enhance `update.cr`
- **Requirements**:
  - Modal or inline form
  - **Mark as complete** checkbox
  - **Report cost** field: "How much did this cost?" [$____]
  - Optional notes
  - Submit → Update task status + cost
  - Confirmation message

**2.5.2 My Tasks View**
- **File**: `src/pages/tasks/my_tasks.cr` (new)
- **Action**: `src/actions/tasks/my_tasks.cr` (new)
- **Requirements**:
  - List all tasks assigned to current user
  - Group by event
  - Show: task name, event, status, cost (if reported)
  - Quick actions: Complete, Report cost, View event
  - Filter: All / Pending / Completed

**Query needed**:
```crystal
TaskQuery.new
  .where_guest_user_id(current_user.id) # via guest.user_id
  .preload_event
  .preload_guest
```

---

### 2.6 Organizer Dashboard (FOR 1-2 POWER USERS)
**Priority**: MEDIUM (fewer users, but important)

**2.6.1 Dashboard for Organizers**
- Same file as guest dashboard, but conditional rendering
- **Show if user has created events**:
  - "Your Events" section with event management
  - "Create New Event" prominent button
  - Quick stats: Total RSVPs across events, pending responses
- **Also show guest sections** (they're guests too!)

**Layout addition for Organizers**:
```
┌─────────────────────────────────────────┐
│ 🎯 Your Events (Organizing)             │
│                                          │
│ ┌─────────────────────────────────┐    │
│ │ Holiday Dinner 2025             │    │
│ │ 15 confirmed, 8 pending, 2 declined │
│ │ 12 tasks assigned, 8 completed  │    │
│ │ Total expenses: $240            │    │
│ │                                  │    │
│ │ [View] [Edit] [Send Reminders]  │    │
│ └─────────────────────────────────┘    │
│                                          │
│ [+ Create New Event]                    │
└─────────────────────────────────────────┘
```

---

### 2.7 Event Management for Organizers
**Priority**: MEDIUM

**2.7.1 Event Index (Organizers)**
- **File**: `src/actions/events/index.cr` (new)
- **File**: `src/pages/events/index_page.cr` (new)
- Simple list of user's events
- Create button
- Edit/View/Delete actions

**2.7.2 Event Creation (Simple Form)**
- **File**: `src/actions/events/new.cr` (new)
- **File**: `src/actions/events/create.cr` (new)
- **File**: `src/pages/events/new_page.cr` (enhance)
- **Simple, single-page form**:
  - Name
  - Date/Time
  - Location (select or create)
  - Description
  - Status (default: Draft)
- Success → Redirect to event show (organizer view)

**2.7.3 Event Show (Organizer View)**
- Enhanced version of guest view
- Additional sections:
  - **Manage Guests**: Invite, remove, resend
  - **Manage Tasks**: Create, assign, view status
  - **Summary Stats**: RSVP breakdown, expense total
  - **Actions**: Edit event, send reminders, export data

**2.7.4 Invite Guests**
- **Action**: `src/actions/guests/create.cr` ✓ (exists)
- **Integration**: Modal on event show page
- **Form**:
  - Select family member (from users) OR
  - Enter email for external guest
  - Send invitation email immediately
- Create `Guest` record with status: NoAnswer

**2.7.5 Assign Tasks**
- **Action**: `src/actions/tasks/create.cr` ✓ (exists)
- **Integration**: Section on event show page
- **Form**:
  - Task name
  - Assign to guest (dropdown)
  - Category (optional)
  - Notes (optional)
- Success → Task appears in guest's task list

---

### 2.8 Location Management
**Priority**: LOW (Organizers only, less frequent)

**Simplify compared to original plan**:
- Locations::Index (list)
- Locations::New/Create (simple form)
- Locations::Show (basic details)
- Locations::Edit/Update
- Used in event creation (dropdown)

---

## 3. Navigation & Layout (Simplified)

### 3.1 Main Layout
**File**: `src/pages/main_layout.cr`

**Navbar for Guests**:
- Logo/Home → Dashboard
- My Events (dropdown):
  - Invitations
  - Confirmed Events
  - Past Events
- My Tasks
- User menu:
  - Profile
  - Sign Out

**Navbar for Organizers** (additional):
- Create Event (+ button)
- Manage Events

**Mobile-first**: Hamburger menu with same structure

### 3.2 Navbar Component
**File**: `src/components/shared/navbar.cr`

Simple, clean navigation focused on guest experience.

---

## 4. Key Components (Revised)

### Guest-Focused Components
- `Dashboard::InvitationCard` - Pending RSVP
- `Dashboard::ConfirmedEventCard` - Confirmed event summary
- `Dashboard::TaskListItem` - Task with quick actions
- `Events::RsvpForm` - RSVP with guest count
- `Events::GuestList` - Who's coming
- `Events::TaskList` - What everyone's bringing
- `Tasks::CompleteForm` - Mark complete + report cost
- `UI::StatusBadge` - RSVP status, task status

### Organizer Components
- `Events::GuestStats` - RSVP breakdown
- `Events::InviteForm` - Invite guest modal
- `Events::TaskAssignForm` - Create/assign task
- `Events::ManagementActions` - Organizer action buttons

### Shared Components
- `Shared::Navbar` - Navigation
- `Shared::FlashMessages` - Success/error messages
- `Shared::Footer` - Simple footer
- `UI::Modal` - Reusable modal
- `UI::EmptyState` - No data states

---

## 5. Email Templates (Critical!)

Emails are the PRIMARY way guests interact with the app.

### 5.1 Event Invitation Email
**File**: `src/emails/event_invitation_email.cr` ✓

**Content**:
```
Subject: You're invited to [Event Name]!

Hi [Guest Name],

[Organizer] has invited you to:

📅 [Event Name]
🗓️  [Date] at [Time]
📍 [Location]

[Description excerpt...]

→ RSVP Now: [Link to /guests/:id/rsvp]
→ View Details: [Link to /events/:id]

We hope to see you there!
```

### 5.2 RSVP Confirmation Email
**File**: `src/emails/rsvp_confirmation_email.cr` ✓

**Content**:
```
Subject: RSVP Confirmed for [Event Name]

Hi [Guest Name],

Thanks for confirming! Here's what you need to know:

✓ You + [X] guests confirmed
📅 [Event Name] on [Date] at [Time]
📍 [Location with map link]

Your tasks:
• [Task 1]
• [Task 2]

→ View Event: [Link]
→ Change RSVP: [Link]

See you there!
```

### 5.3 Task Assignment Email
**File**: `src/emails/task_assigned_email.cr` (new)

**Content**:
```
Subject: Task assigned for [Event Name]

Hi [Guest Name],

[Organizer] has assigned you a task for [Event Name]:

📋 [Task Name]
💡 [Notes if any]

Please mark it complete and report cost when done:
→ [Link to task or event]

Thanks for helping out!
```

### 5.4 Event Reminder Email
**File**: `src/emails/event_reminder_email.cr` (new)

**Content**:
```
Subject: Reminder: [Event Name] is tomorrow!

Hi [Guest Name],

Just a friendly reminder:

📅 [Event Name]
🗓️  Tomorrow at [Time]
📍 [Location with map]

Your tasks:
• [Task] - Status: [Pending/Complete]

→ View all details: [Link]

See you soon!
```

---

## 6. Implementation Phases (Revised)

### Phase 1: Guest Experience Foundation (Week 1) - CRITICAL
**Goal**: Guest can sign in and RSVP

1. Create simple landing page (home/index_page.cr)
2. Update MainLayout with basic navbar
3. Rewrite Dashboard (Me::Show) for guest-first view
   - Show pending invitations
   - Show confirmed events
   - Show assigned tasks
4. Implement RSVP flow:
   - Quick RSVP from dashboard (modal)
   - Full RSVP page (/guests/:id/rsvp)
   - Update SaveGuest to handle guest count
5. Create guest-focused event show page

**Deliverable**: Family member receives email invite, signs in, sees invitation, can RSVP with guest count, sees event details.

### Phase 2: Task Interaction (Week 2) - CRITICAL
**Goal**: Guest can manage their tasks

1. Implement task completion flow:
   - Mark task complete
   - Report cost spent
2. Create "My Tasks" view
3. Add task quick actions to dashboard
4. Update event show page with "Your Tasks" section
5. Show task status and expenses in event view

**Deliverable**: Guest can see assigned tasks, mark them complete, report expenses.

### Phase 3: Organizer Event Creation (Week 3) - HIGH
**Goal**: Organizer can create events and invite guests

1. Create Events::Index for organizers
2. Implement Events::New and Create (simple form)
3. Add location selector (simple dropdown)
4. Create location CRUD (basic)
5. Enhance dashboard for organizers
6. Add "Create Event" navigation

**Deliverable**: Organizer can create events, select locations.

### Phase 4: Guest Management (Week 4) - HIGH
**Goal**: Organizer can invite guests and assign tasks

1. Implement guest invitation UI (modal on event show)
2. Create task assignment UI (section on event show)
3. Enhance event show for organizers:
   - Guest list with stats
   - Task list with assignments
   - Expense totals
4. Test invitation email flow end-to-end

**Deliverable**: Organizer can invite family members, assign tasks, send emails.

### Phase 5: Polish & Email Templates (Week 5) - MEDIUM
**Goal**: Professional, cohesive experience

1. Create HTML email templates
2. Add event reminder emails
3. Implement "resend invitation" feature
4. Add RSVP reminders
5. Polish all pages for consistent design
6. Mobile responsiveness review
7. Add empty states and loading indicators

**Deliverable**: Professional-looking emails, polished UI, good mobile experience.

### Phase 6: Nice-to-Have Features (Week 6+) - LOW
**Goal**: Additional convenience features

1. Export guest list (CSV)
2. Event photo upload
3. Guest-to-guest messaging
4. Calendar export (iCal)
5. SMS reminders
6. Multi-step event wizard (restore from backup)

**Deliverable**: Enhanced features for power users.

---

## 7. Database Schema Additions

### 7.1 DependentGuests (Family Members) ✓ IMPLEMENTED

For "cousinades" (family reunions), we need to track the actual family members, not just a count.

**Guest** = Main representative (e.g., "Uncle Bob")
**DependentGuest** = Spouse, kids, etc. (e.g., "Sarah Smith - spouse", "Tim Smith - son, 12")

```crystal
# guests table - UPDATED ✓
column guest_count : Int32 = 1  # Still track count for quick stats
column notes : String?  # RSVP notes
has_many dependent_guests : DependentGuest

# dependent_guests table - CREATED ✓
column name : String  # "Sarah Smith"
column age : Int32?  # 35
column relationship : String?  # "spouse", "son", "daughter"
column dietary_restrictions : String?  # "vegetarian", "gluten-free"
belongs_to guest : Guest
```

**Usage**:
When Uncle Bob RSVPs:
1. Confirms attendance for himself (Guest)
2. Adds dependent guests:
   - Sarah Smith (spouse, 35)
   - Tim Smith (son, 12, vegetarian)
   - Emily Smith (daughter, 8)
3. Total attendees: 4 (1 + 3 dependents)

**Benefits**:
- Know exactly who is coming (names for name tags!)
- Track ages (kids vs adults)
- Track dietary restrictions per person
- Generate accurate headcount

### 7.2 Task Cost
Add explicit cost tracking to tasks:
```crystal
# Optional enhancement - use notes field for now
add cost_amount : Float64?
add cost_notes : String?  # "3 bottles at $15 each"
```

---

## 8. Key Metrics (For Organizers)

Show on event page for organizers:

1. **RSVP Status**:
   - X confirmed (Y people total)
   - Z pending
   - W declined

2. **Task Status**:
   - X tasks total
   - Y completed
   - Z pending

3. **Expenses**:
   - Total reported: $XXX
   - From X tasks
   - Average per task

---

## 9. Success Criteria (Revised)

The app is successful when:

### For Guests (90% of users):
1. ✅ I receive an email invitation to a family event
2. ✅ I can click a link and sign in (or create account quickly)
3. ✅ I can RSVP "yes" or "no" and indicate how many people I'm bringing
4. ✅ I can see what I'm assigned to bring/do
5. ✅ I can mark tasks complete and report what I spent
6. ✅ I can see who else is coming and what they're bringing
7. ✅ I can find event details (date, time, location) easily
8. ✅ The entire experience takes less than 2 minutes
9. ✅ I don't need to learn a complex interface
10. ✅ It works on my phone

### For Organizers (10% of users):
1. ✅ I can create an event with date, time, location
2. ✅ I can invite family members by selecting them or entering emails
3. ✅ I can assign tasks to guests (who brings what)
4. ✅ I can see who has RSVP'd and who hasn't
5. ✅ I can see task completion status
6. ✅ I can see total expenses reported
7. ✅ I can send reminder emails
8. ✅ The interface is simple enough for a non-technical family member

---

## 10. UI Simplifications

### What NOT to Build (compared to original plan):

1. ❌ Complex dashboard with charts and analytics
2. ❌ Advanced filtering and search
3. ❌ Pagination (family events are small, show all)
4. ❌ Multiple event views (list/grid/calendar)
5. ❌ Complex task categories and priorities
6. ❌ Real-time notifications
7. ❌ Social features (comments, likes)
8. ❌ Event templates
9. ❌ Recurring events
10. ❌ Advanced location features (geocoding, maps API)

### What to Keep Simple:

1. **Locations**: Basic form, no map integration needed (Google Maps link is enough)
2. **Tasks**: Just name, notes, assigned to, status, cost
3. **Guests**: Just user + status + guest count
4. **Events**: Just name, date, time, location, description
5. **Navigation**: Home, My Events, My Tasks, Sign Out

---

## 11. Mobile-First Considerations

Since guests check on their phones:

1. **Large touch targets**: All buttons at least 44px
2. **No hover states**: Click/tap only
3. **Simple forms**: Minimal fields, large inputs
4. **Clear hierarchy**: One main action per screen
5. **Bottom navigation** (optional): Sticky nav at bottom on mobile
6. **Swipe actions** (optional): Swipe to RSVP, complete task

---

## 12. File Checklist (Revised & Prioritized)

### Phase 1 (Week 1) - Guest RSVP
- [ ] `src/pages/home/index_page.cr` - Landing page
- [ ] `src/pages/me/show_page.cr` - Dashboard (guest-first)
- [ ] `src/actions/guests/rsvp.cr` - RSVP action
- [ ] `src/pages/guests/rsvp_page.cr` - RSVP page
- [ ] `src/components/dashboard/invitation_card.cr`
- [ ] `src/components/dashboard/confirmed_event_card.cr`
- [ ] `src/components/events/rsvp_form.cr`
- [ ] Update `src/components/shared/navbar.cr`
- [ ] Update `src/pages/main_layout.cr`

### Phase 2 (Week 2) - Task Management
- [ ] `src/actions/tasks/my_tasks.cr` - My tasks action
- [ ] `src/pages/tasks/my_tasks_page.cr` - My tasks page
- [ ] `src/actions/tasks/complete.cr` - Complete task action
- [ ] `src/components/tasks/complete_form.cr`
- [ ] `src/components/dashboard/task_list_item.cr`
- [ ] Migration: Add `guest_count` to guests
- [ ] Update `SaveGuest` to include guest_count

### Phase 3 (Week 3) - Event Creation
- [ ] `src/actions/events/index.cr` - Event list
- [ ] `src/pages/events/index_page.cr` - Event list page
- [ ] `src/actions/events/new.cr` - New event form
- [ ] `src/actions/events/create.cr` - Create event
- [ ] `src/actions/locations/index.cr` - Location list
- [ ] `src/actions/locations/new.cr` - New location
- [ ] `src/actions/locations/create.cr` - Create location
- [ ] `src/pages/locations/index_page.cr` - Location list page
- [ ] `src/components/events/location_selector.cr`

### Phase 4 (Week 4) - Guest & Task Assignment
- [ ] `src/components/events/invite_form.cr` - Invite modal
- [ ] `src/components/events/task_assign_form.cr` - Assign task modal
- [ ] `src/components/events/guest_stats.cr` - RSVP stats
- [ ] `src/components/events/guest_list.cr` - Guest list with status
- [ ] Enhance `src/pages/events/show_page.cr` - Full organizer view

### Phase 5 (Week 5) - Email & Polish
- [ ] `src/emails/templates/event_invitation_email/*.ecr` - HTML templates
- [ ] `src/emails/templates/rsvp_confirmation_email/*.ecr` - HTML templates
- [ ] `src/emails/task_assigned_email.cr` - New email
- [ ] `src/emails/event_reminder_email.cr` - New email
- [ ] `src/components/shared/footer.cr` - Footer
- [ ] `src/components/ui/empty_state.cr` - Empty states
- [ ] `src/components/ui/modal.cr` - Modal component
- [ ] Polish all pages for consistency

---

## 13. Quick Start for Phase 1

```bash
# Generate actions
crystal run tasks.cr -- gen.action Guests::Rsvp

# Generate pages
crystal run tasks.cr -- gen.page Home::IndexPage
crystal run tasks.cr -- gen.page Guests::RsvpPage

# Generate components
crystal run tasks.cr -- gen.component Dashboard::InvitationCard
crystal run tasks.cr -- gen.component Dashboard::ConfirmedEventCard
crystal run tasks.cr -- gen.component Events::RsvpForm

# Create migration for guest_count
crystal run tasks.cr -- gen.migration AddGuestCountToGuests

# Run server
lucky dev  # Now on port 3002
```

---

## 14. Sample Guest Journey

**Marie creates "Holiday Dinner 2025"**
1. Marie signs in → Dashboard → "Create Event"
2. Fills form: Name, Date, Location, Description
3. Clicks "Save" → Event created (Draft)
4. Event show page → "Invite Guests"
5. Selects family members: Bob, Susan, Mike (+ 10 more)
6. Clicks "Send Invitations"
7. System creates Guest records, sends emails

**Uncle Bob RSVPs**
1. Bob receives email: "You're invited to Holiday Dinner 2025!"
2. Clicks "RSVP Now" link
3. Lands on RSVP page, sees event details
4. Clicks "Yes, I'll be there!"
5. System asks: "How many people total?" → Bob enters "4" (him + family)
6. Clicks "Confirm RSVP"
7. System updates guest status, sends confirmation email
8. Bob lands on dashboard, sees "Holiday Dinner" in "Confirmed Events"

**Marie assigns task**
1. Marie goes to event show page
2. Scrolls to "Tasks" section → "Add Task"
3. Fills: "Bring wine" / Assign to: "Uncle Bob"
4. Clicks "Assign"
5. System creates task, sends email to Bob

**Bob completes task**
1. Bob receives email: "Task assigned for Holiday Dinner"
2. Clicks link → Event page → Sees "Your Tasks" section
3. Brings wine to the event
4. After dinner, opens app on phone
5. Clicks "Mark Complete" next to "Bring wine"
6. Modal asks: "How much did this cost?" → Bob enters "$45"
7. Clicks "Save"
8. System updates task status, Marie sees it on event page

**Day after event**
- Marie reviews event: Total expenses: $240 (across all tasks)
- Marie can see who brought what and how much was spent
- Marie can export guest list for thank-you cards

---

## 15. Estimated Effort (Revised)

**Total**: 5-6 weeks for fully functional family app

- **Phase 1** (Guest RSVP): 1 week - CRITICAL
- **Phase 2** (Task Management): 1 week - CRITICAL
- **Phase 3** (Event Creation): 1 week - HIGH
- **Phase 4** (Guest/Task Assignment): 1 week - HIGH
- **Phase 5** (Polish & Emails): 1 week - MEDIUM
- **Phase 6** (Nice-to-haves): Ongoing - LOW

**Minimum Viable Product**: Phases 1-4 = 4 weeks

---

**This revised plan focuses on the 90% use case: simple, fast RSVP and task reporting for family guests, with straightforward event management for organizers.**
