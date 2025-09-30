# Fiesta - Code Audit & Action Plan

**Project:** Fiesta - Private Family Event Organizer
**Framework:** Lucky 1.3.0 (Crystal)
**Audit Date:** 2025-09-30
**Total Files:** 177 Crystal files (~4,323 LOC)

---

## Executive Summary

Fiesta is a private family event organizer in early development. As a closed, family-only application, the focus should be on **data integrity**, **testing**, **completing core features**, and **code cleanup** rather than enterprise security measures.

**Priority Levels:**
- 🔴 **CRITICAL** - Data integrity, authorization within family, broken features
- 🟡 **HIGH** - Core features, testing, user experience
- 🟢 **MEDIUM** - Nice-to-haves, polish, future features
- 🔵 **LOW** - Cleanup, documentation

---

## 🔴 CRITICAL ISSUES

### 1. CSRF Protection Disabled
**Location:** `src/actions/browser_action.cr:2`
```crystal
# include Lucky::ProtectFromForgery  # ❌ COMMENTED OUT
```

**Why it matters for family app:** Even within family, prevents accidental double-submissions and basic security hygiene.

**Action:** Uncomment the line (30 seconds)

---

### 2. No Authorization - Any Family Member Can Delete Anyone's Events
**Locations:** `Events::Show`, `Events::Delete`, `Events::Update`, `Locations::*`, etc.

**Examples:**
```crystal
# Events::Delete - Anyone can delete any event!
delete "/events/:event_id" do
  event = EventQuery.find(event_id)  # ❌ No ownership check
  DeleteEvent.delete(event)
end
```

**Impact:** Uncle Bob accidentally deletes your wedding planning event.

**Action:**
- Create simple authorization mixin:
  ```crystal
  module RequireEventOwnership
    private def verify_ownership(event : Event)
      return if event.creator_id == current_user.id
      flash.failure = "You can only modify your own events"
      redirect Events::Index
    end
  end
  ```
- Apply to edit/update/delete actions
- Allow event creator + invited guests to view (read-only for guests)

**Estimated effort:** 2-3 hours

---

### 3. Hardcoded Secret Key in Code
**Location:** `config/server.cr:17`
```crystal
settings.secret_key_base = "P9c/xE7PrEPJ8k64OUaobN/5xUOcGkjrMImLsd+CiLY="
```

**Why it matters:** This key is in git history. Anyone with repo access can forge sessions.

**Action:**
```bash
# Generate new key
lucky gen.secret_key

# Create .env file (already gitignored)
echo "SECRET_KEY_BASE=<generated-key>" > .env

# Update config/server.cr
settings.secret_key_base = ENV["SECRET_KEY_BASE"]
```

**Estimated effort:** 5 minutes

---

### 4. Missing Validations = Data Corruption Risk
**Locations:** `SaveEvent`, `SaveLocation`, `SaveGuest`, `SaveTask`

**Current issues:**
- Events can have `end_at` before `start_at`
- Events can be in the past when created
- Locations with lat but no long (or vice versa)
- Guest has NO validations at all
- Tasks have no status/completion tracking
- User name defaults to "choucroute" (?)

**Action:**
- Uncomment and test event date validations in `SaveEvent`
- Uncomment coordinate validation in `SaveLocation`
- Add proper columns to `SaveGuest`:
  ```crystal
  permit_columns status, user_id, event_id, answered_at
  before_save do
    validate_required user_id, event_id
    # Prevent duplicate invitations
    validate_uniqueness_of user_id, query: GuestQuery.new.event_id(event_id.value)
  end
  ```
- Fix User model default name (make optional or require on signup)

**Estimated effort:** 4-5 hours

---

### 5. Incomplete Features Blocking Usage
**Location:** `src/actions/events/create.cr` - Entire file commented out

**Status:** Old event creation commented, new wizard partially done.

**Impact:** Can't actually create events properly?

**Action:**
- Remove all commented code (it's in git history anyway)
- Complete wizard flow in `events/wizard/creation/`
- Test full flow: basic info → dates → location → description → summary → save
- Ensure each step saves draft state (so users don't lose work)

**Estimated effort:** 6-8 hours

---

### 6. Guest Invitation System Missing
**Current state:** Guest model exists but no way to invite family members

**What's missing:**
- Can't send invitations to family members
- No RSVP workflow
- Guest status changes don't work
- No email notifications when invited

**Action:**
- Build simple invitation flow:
  1. Event creator searches for family member by name/email
  2. Add them as guest with status: NoAnswer
  3. Send email notification
  4. Guest clicks link → sees event details → confirms/declines
  5. Status updates to Confirmed/Declined with timestamp
- Don't need fancy tokens - family members have accounts

**Estimated effort:** 8-10 hours

---

### 7. Database Foreign Key Issues
**Location:** Migration files

**Problems:**
- No unique constraint on `guests(user_id, event_id)` → can invite same person multiple times
- `on_delete: :nullify` on critical relations → orphaned data
- Event name globally unique (line `create_events.cr:7`) → Can't have two "Christmas Dinner" events

**Action:**
- Create migration:
  ```crystal
  # Add unique constraint to prevent duplicate invitations
  alter table_for(Guest) do
    add_index [:user_id, :event_id], unique: true
  end

  # Remove global uniqueness on event name (should be unique per creator only)
  alter table_for(Event) do
    remove_index :name
    add_index [:creator_id, :name], unique: true
  end

  # Same for locations
  alter table_for(Location) do
    remove_index :name
    add_index [:creator_id, :name], unique: true
  end
  ```
- Change `Task.on_delete: :cascade` (tasks should delete with event)
- Change `Guest.on_delete: :cascade` (guest list should delete with event)

**Estimated effort:** 2 hours

---

## 🟡 HIGH PRIORITY

### 8. No Test Coverage for Core Workflows
**Current:** Only 16 test files, mostly auth

**Missing tests:**
- Event CRUD (create, edit, delete)
- Authorization (can't modify others' events)
- Validations (invalid dates, etc.)
- Guest invitation flow
- Wizard steps

**Action:**
Write tests for:
```crystal
# spec/operations/save_event_spec.cr
describe SaveEvent do
  it "prevents end date before start date" do
    # ...
  end

  it "prevents past events" do
    # ...
  end

  it "allows same name for different creators" do
    # ...
  end
end

# spec/requests/events/delete_spec.cr
describe Events::Delete do
  it "allows creator to delete their event" do
    # ...
  end

  it "prevents non-creator from deleting event" do
    # ...
  end
end
```

**Estimated effort:** 10-12 hours

---

### 9. User Experience Issues
**Current problems:**
- No loading states (forms just hang)
- No confirmation on delete (oops deleted wedding!)
- Error messages not user-friendly
- No draft auto-save in wizard
- Can't go back in wizard

**Action:**
- Add delete confirmations:
  ```crystal
  link "Delete", Events::Delete.with(event.id),
    data_confirm: "Really delete '#{event.name}'? This can't be undone."
  ```
- Add HTMX loading indicators
- Improve flash messages
- Auto-save wizard drafts every step
- Add back button to wizard
- Show validation errors inline

**Estimated effort:** 5-6 hours

---

### 10. Task System Incomplete
**Current:** Task model exists but barely functional

**Missing:**
- No status/completion tracking
- Can't mark tasks done
- No assignment workflow
- No task ordering
- No categories (shopping, cooking, setup)

**Action:**
- Add to Task model:
  ```crystal
  column status : Task::Status = Task::Status::Pending
  column completed_at : Time?
  column position : Int32  # For ordering
  column category : String?
  column notes : String?
  ```
- Build task board UI (simple list with checkboxes)
- Allow reordering tasks
- Notify assigned guest via email

**Estimated effort:** 6-8 hours

---

### 11. Location Enhancements
**Current:** Manual lat/long entry (tedious!)

**Missing:**
- Address autocomplete
- Map display
- Geocoding (address → coordinates)
- Favorite/saved locations

**Action:**
- Integrate OpenStreetMap Nominatim (free geocoding)
- Add address autocomplete using Nominatim search
- Display map with Leaflet (already in package.json)
- Allow saving frequently used locations (Grandma's house, etc.)

**Estimated effort:** 8-10 hours

---

### 12. Email Notifications
**Current:** SendGrid configured but no emails sent

**Missing notifications:**
- Event invitation
- RSVP confirmation
- Event reminder (1 day before)
- Event updates (date/location changed)
- Task assignment

**Action:**
- Create email templates in `src/emails/`
- Keep emails simple (plain text OK, family doesn't need fancy HTML)
- Add "Email Preferences" so people can opt out
- Test with real email addresses

**Estimated effort:** 6-8 hours

---

## 🟢 MEDIUM PRIORITY

### 13. Event Features
**Nice-to-haves:**
- Event photos/images
- Guest count tracking
- Cost splitting (who owes what)
- Shopping list (separate from tasks)
- Event comments/discussion
- Calendar export (iCal)
- Print view

**Action:** Pick 2-3 based on family needs

**Estimated effort:** 3-5 hours each

---

### 14. Better Error Handling
**Current issues:**
- `RequireEventFromId` returns plain text "Event not found"
- No 404 page styling
- Errors don't distinguish "not found" vs "no permission"

**Action:**
- Return proper error pages
- Add friendly 404/403 pages
- Don't reveal if events exist when user lacks permission

**Estimated effort:** 2-3 hours

---

### 15. Mobile Experience
**Current:** Uses Tailwind but not tested on mobile

**Action:**
- Test on actual phones
- Ensure forms work well on mobile
- Make sure buttons are touch-friendly
- Test wizard flow on mobile

**Estimated effort:** 3-4 hours

---

### 16. User Profile & Settings
**Missing:**
- Profile page
- Edit name/email
- Change password
- Notification preferences
- Timezone setting

**Action:**
- Build simple profile page
- Add settings for email notifications
- Allow password change
- Show user's upcoming events

**Estimated effort:** 4-5 hours

---

## 🔵 LOW PRIORITY / CLEANUP

### 17. Code Cleanup
**Issues:**
- `wizard/old--` directory still present
- Commented code everywhere (SaveEvent, SaveLocation, Events::Create)
- Empty query classes (EventQuery, LocationQuery)
- `tmp/tasks_binary` tracked in git
- User default name "choucroute"

**Action:**
- Delete `wizard/old--` directory
- Remove ALL commented code (it's in git history)
- Add query scopes:
  ```crystal
  class EventQuery < Event::BaseQuery
    def for_user(user : User)
      where { (creator_id == user.id) }
    end

    def upcoming
      where { (start_at > Time.utc) }
    end

    def ordered
      order_by { start_at.asc }
    end
  end
  ```
- Fix gitignore for binaries
- Fix user model defaults

**Estimated effort:** 2-3 hours

---

### 18. Pagination
**Current:** Event/Location indexes load everything

**Action:**
- Add pagination to Events::Index, Locations::Index
- Lucky has built-in pagination support
- 20-30 items per page is fine for family use

**Estimated effort:** 1-2 hours

---

### 19. Search/Filtering
**Missing:**
- Can't search events by name
- Can't filter by date range
- Can't filter by status

**Action:**
- Add simple search bar on Events::Index
- Add filters: "Upcoming", "Past", "Drafts", "Cancelled"
- Search by name, location, guest name

**Estimated effort:** 3-4 hours

---

### 20. Development Experience
**Missing:**
- No seed data (tedious to test)
- No development docs

**Action:**
- Create `db/seeds.cr`:
  ```crystal
  # Create family members
  alice = UserBox.create &.email("alice@family.com")
  bob = UserBox.create &.email("bob@family.com")

  # Create sample event
  event = EventBox.create &.creator(alice).name("Family BBQ")

  # Add guests
  GuestBox.create &.user(bob).event(event)
  ```
- Write README with setup instructions
- Document common tasks

**Estimated effort:** 2-3 hours

---

### 21. Deployment
**Missing:**
- No deployment instructions
- No backup strategy

**Action:**
- Document deployment (probably Heroku or Fly.io)
- Set up automated database backups
- Document how to restore from backup

**Estimated effort:** 2-3 hours

---

## Implementation Priority

### Week 1: Fix Critical Issues 🔴
**Goal:** App is safe and functional
- [ ] Enable CSRF protection (30 min)
- [ ] Move secret to .env (5 min)
- [ ] Add authorization checks (2-3 hours)
- [ ] Complete event wizard (6-8 hours)
- [ ] Add data validations (4-5 hours)
- [ ] Fix database constraints (2 hours)

**Total:** ~15-20 hours

---

### Week 2: Complete Core Features 🟡
**Goal:** App is actually usable for planning events
- [ ] Build guest invitation system (8-10 hours)
- [ ] Set up email notifications (6-8 hours)
- [ ] Improve UX (confirmations, loading states) (5-6 hours)

**Total:** ~20-25 hours

---

### Week 3: Testing & Polish 🟡
**Goal:** Confidence it won't break
- [ ] Write tests for critical paths (10-12 hours)
- [ ] Complete task system (6-8 hours)
- [ ] Mobile testing & fixes (3-4 hours)
- [ ] Better error pages (2-3 hours)

**Total:** ~20-25 hours

---

### Week 4: Nice-to-Haves 🟢
**Goal:** Delight users
- [ ] Location enhancements (maps, autocomplete) (8-10 hours)
- [ ] User profiles & settings (4-5 hours)
- [ ] Event features (photos, calendar export, etc.) (5-10 hours)
- [ ] Search & filtering (3-4 hours)

**Total:** ~20-30 hours

---

### Week 5: Cleanup & Launch 🔵
**Goal:** Ship it!
- [ ] Code cleanup (remove commented code, etc.) (2-3 hours)
- [ ] Add pagination (1-2 hours)
- [ ] Create seed data (2-3 hours)
- [ ] Write deployment docs (2-3 hours)
- [ ] Final testing with family (5 hours)

**Total:** ~12-15 hours

---

## Total Effort Estimate

**Critical Path (Weeks 1-2):** 35-45 hours → **Minimum Viable Product**
**Full Feature Set (Weeks 1-4):** 75-100 hours → **Polished Family App**
**Production Ready (Weeks 1-5):** 90-120 hours → **Launch Ready**

---

## Quick Wins (Do These First - Under 1 Hour)

```bash
# 1. Enable CSRF (30 seconds)
# In src/actions/browser_action.cr, uncomment line 2
include Lucky::ProtectFromForgery

# 2. Fix secret key (5 minutes)
lucky gen.secret_key  # Copy the output
echo "SECRET_KEY_BASE=<paste-key-here>" > .env
# Then update config/server.cr to use ENV["SECRET_KEY_BASE"]

# 3. Clean up git (1 minute)
git rm tmp/tasks_binary
echo "tmp/tasks_binary" >> .gitignore

# 4. Fix user default name (30 seconds)
# In src/models/user.cr:8, change to:
column name : String

# 5. Add delete confirmation (2 minutes per page)
# In any delete link, add:
data_confirm: "Really delete this?"
```

---

## What NOT to Worry About (For Family App)

❌ **Skip these enterprise concerns:**
- Rate limiting (you trust your family)
- APM/monitoring (just check logs if something breaks)
- Advanced security headers (CSRF is enough)
- OAuth/SSO (just use email/password)
- API versioning (no external API consumers)
- Microservices (keep it simple!)
- Redis caching (PostgreSQL is fine)
- CDN for assets (serve locally)
- Load balancing (one server is plenty)
- Advanced audit logging (DB timestamps are enough)

✅ **Focus on:**
- Works reliably
- Data doesn't get corrupted
- Good UX for family members
- Easy to maintain
- Well tested
- Simple to deploy

---

## Success Criteria

### Minimum Viable (Week 2)
- ✅ Create events with wizard
- ✅ Invite family members
- ✅ RSVPs work
- ✅ Email notifications sent
- ✅ Can't delete others' events
- ✅ Dates validate correctly

### Polished (Week 4)
- ✅ Tasks assign and track
- ✅ Locations have maps
- ✅ Works well on mobile
- ✅ User profiles complete
- ✅ Core features tested

### Production Ready (Week 5)
- ✅ No commented code
- ✅ Seed data for development
- ✅ Deployed and accessible
- ✅ Backup strategy in place
- ✅ Family members can use it successfully

---

## Next Steps

1. **Review with family:** Which features are most important?
2. **Start with Quick Wins:** Get 5 fixes done in under an hour
3. **Complete Week 1:** Focus on critical issues only
4. **Test with family:** Get real feedback after Week 2
5. **Iterate:** Adjust priorities based on actual usage

---

**Remember:** This is a family app, not a startup. Simple, reliable, and usable beats fancy features every time. Get something working in 2 weeks, then polish based on real feedback from family members.