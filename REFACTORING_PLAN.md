# Fiesta - Code Review & Refactoring Plan

## Executive Summary

This document outlines opportunities for code improvements, refactoring, and architectural enhancements identified during a comprehensive review of the Fiesta application codebase.

**Key Findings:**
- 116 action files with several patterns that can be extracted and standardized
- 4 policy classes with duplicated helper methods
- Hardcoded strings mixed with i18n translations
- Repetitive query patterns across actions
- Missing mixin for common event loading patterns

---

## 1. Policy Layer Improvements

### 1.1 Extract Common Policy Helpers into Concern/Module

**Issue:** The `organizer?` and `confirmed_guest?` methods are duplicated across multiple policy classes.

**Current State:**
- `EventPolicy` has `organizer?`, `guest?`, and `confirmed_guest?`
- `TaskPolicy` has `organizer?` (different implementation - via task.event)
- `GuestPolicy` has `organizer?` (via guest.event)
- `SecretSantaPolicy` has `organizer?` and `confirmed_guest?` (via secret_santa.event)

**Files Affected:**
- `src/policies/event_policy.cr:41-63`
- `src/policies/task_policy.cr:28-32`
- `src/policies/guest_policy.cr:18-22`
- `src/policies/secret_santa_policy.cr:19-34`

**Recommendation:**

Create a shared module `src/policies/concerns/event_authorization_helpers.cr`:

```crystal
module Policies::Concerns::EventAuthorizationHelpers
  # For policies where record IS an Event
  private def organizer?
    return false unless current_user = user
    record.creator_id == current_user.id
  end

  private def guest?
    return false unless current_user = user
    GuestQuery.new
      .event_id(record.id)
      .user_id(current_user.id)
      .first?
      .present?
  end

  private def confirmed_guest?
    return false unless current_user = user
    GuestQuery.new
      .event_id(record.id)
      .user_id(current_user.id)
      .confirmed
      .first?
      .present?
  end
end

module Policies::Concerns::EventRelatedAuthorizationHelpers
  # For policies where record has an event association
  private def organizer?
    return false unless current_user = user
    event = record.event
    event.creator_id == current_user.id
  end

  private def confirmed_guest?
    return false unless current_user = user
    event = record.event
    GuestQuery.new
      .event_id(event.id)
      .user_id(current_user.id)
      .confirmed
      .first?
      .present?
  end
end
```

**Impact:** Reduces code duplication by ~50 lines, improves maintainability, ensures consistent authorization logic.

---

### 1.2 Fix SecretSantaAssignmentPolicy Variable Naming Issue

**Issue:** In `SecretSantaAssignmentPolicy#giver?`, the variable is named `current_user` but the actual user is `user` (line 8).

**File:** `src/policies/secret_santa_assignment_policy.cr:8`

**Current Code:**
```crystal
private def giver?
  return false unless current_user = user  # Should use 'user' directly
  return false unless giver = record.giver
  giver.user_id == current_user.id
end
```

**Recommendation:** Use consistent naming - either rename to match the pattern or use `user` directly:

```crystal
private def giver?
  return false unless giver = record.giver
  giver.user_id == user.id
end
```

**Impact:** Improves code clarity, reduces confusion.

---

## 2. Action Layer Improvements

### 2.1 Extract Common Event Loading Pattern

**Issue:** Multiple actions load events with the same pattern (preload_creator, find by event_id).

**Pattern Found:** 5+ occurrences in files like:
- `src/actions/events/check_in_mode.cr:3-5`
- `src/actions/events/add_task.cr:3-5`
- `src/actions/events/expense_split.cr:3-5`
- `src/actions/events/invite_guests.cr:3-5`
- `src/actions/events/show_messages.cr:3-5`

**Current Code:**
```crystal
event = EventQuery.new
  .preload_creator
  .find(event_id)
```

**Recommendation:**

Create a mixin `src/actions/mixins/require_event_with_creator.cr`:

```crystal
module RequireEventWithCreator
  macro included
    include Rosetta::Translatable
    before enforce_event_found

    @_event : Event?
  end

  private def event : Event
    @_event.not_nil!
  end

  private def enforce_event_found
    event_id = params.get(:event_id).to_i64
    @_event = EventQuery.new
      .preload_creator
      .find(event_id)
    continue
  rescue Avram::RecordNotFoundError
    flash.failure = r("events.not_found").t
    redirect to: Me::Show
  end
end
```

**Impact:** Reduces 5-10 lines per action, ensures consistent error handling, follows existing pattern from `RequireTaskFromId` and `RequireGuestFromId`.

---

### 2.2 Extract Common Confirmed Guests Loading Pattern

**Issue:** Multiple actions load confirmed guests with identical query chains.

**Pattern Found:** 6+ occurrences including:
- `src/actions/events/add_task.cr:10-14`
- `src/actions/events/expense_split.cr:10-14`
- Multiple other event-related actions

**Current Code:**
```crystal
guests = GuestQuery.new
  .for_event(event)
  .confirmed
  .preload_user
  .results
```

**Recommendation:**

Add helper method to `EventQuery` or create a service object:

```crystal
# Option A: Add to GuestQuery
class GuestQuery < Guest::BaseQuery
  def confirmed_for_event_with_users(event : Event)
    for_event(event)
      .confirmed
      .preload_user
      .results
  end
end

# Usage:
guests = GuestQuery.new.confirmed_for_event_with_users(event)
```

**Alternative:** Create a concern for actions that need this:

```crystal
module Actions::Concerns::GuestLoading
  private def load_confirmed_guests(event : Event)
    GuestQuery.new
      .for_event(event)
      .confirmed
      .preload_user
      .results
  end
end
```

**Impact:** Reduces 5 lines per action, makes queries more semantic and readable.

---

### 2.3 Standardize Flash Message Translations

**Issue:** Mixed use of hardcoded strings and i18n translations for flash messages.

**Examples of Hardcoded Strings:**
- `src/actions/secret_santa/update_status.cr:26` - `"Status updated successfully"`
- `src/actions/guests/undo_check_in.cr:13` - `"Check-in annulé"` (French hardcoded!)
- `src/actions/secret_santa/randomize.cr:24` - `"Need at least 2 confirmed guests for Secret Santa"`
- `src/actions/secret_santa/randomize.cr:31` - `"Failed to create assignments"`
- `src/actions/events/export_calendar.cr:14` - `"Cannot export event without a start date"`

**Files Affected:**
- `src/actions/secret_santa/update_status.cr:26`
- `src/actions/guests/undo_check_in.cr:13`
- `src/actions/secret_santa/randomize.cr:24,31`
- `src/actions/events/export_calendar.cr:14`

**Recommendation:**

Replace all hardcoded strings with i18n keys:

```crystal
# Before:
flash.success = "Status updated successfully"

# After:
flash.success = r("secret_santa.status_updated").t
```

Add corresponding translations to your i18n files.

**Impact:** Ensures full internationalization support, removes hardcoded French string, improves consistency.

---

### 2.4 Inconsistent Error Handling in RequireEventFromId

**Issue:** `RequireEventFromId` mixin has inconsistent behavior compared to `RequireTaskFromId` and `RequireGuestFromId`.

**Current Implementations:**

**RequireEventFromId** (inconsistent):
```crystal
# src/actions/mixins/require_event_from_id.cr:14-19
private def require_event_from_id
  if event
    continue
  else
    plain_text "Event not found"  # No flash, plain text only
  end
end
```

**RequireTaskFromId** (better pattern):
```crystal
# src/actions/mixins/require_task_from_id.cr:13-20
private def enforce_task_found
  task_id = params.get(:task_id).to_i64
  @_task = TaskQuery.new.preload_event.preload_guest.find(task_id)
  continue
rescue Avram::RecordNotFoundError
  flash.failure = r("tasks.not_found").t
  redirect to: Me::Show
end
```

**Recommendation:**

Refactor `RequireEventFromId` to match the pattern:

```crystal
module RequireEventFromId
  macro included
    include Rosetta::Translatable
    before enforce_event_found

    @_event : Event?
  end

  private def event : Event
    @_event.not_nil!
  end

  private def enforce_event_found
    event_id = params.get(:event_id).to_i64
    @_event = EventQuery.new.find(event_id)
    continue
  rescue Avram::RecordNotFoundError
    flash.failure = r("events.not_found").t
    redirect to: Me::Show
  end
end
```

**Impact:** Consistent error handling across all resource loading mixins, better user experience.

---

### 2.5 Replace Manual Authorization in Tasks::Start

**Issue:** `Tasks::Start` performs manual authorization checks instead of using the policy.

**File:** `src/actions/tasks/start.cr:7-16`

**Current Code:**
```crystal
# Ensure user is the assigned guest
if guest = task.guest
  if guest.user_id != current_user.id
    flash.failure = r("errors.unauthorized").t
    redirect to: Me::Show
  end
else
  flash.failure = r("tasks.not_assigned").t
  redirect to: Me::Show
end
```

**Recommendation:**

Add a `start?` method to `TaskPolicy` and use the standard authorization pattern:

```crystal
# In TaskPolicy:
def start?
  assigned_to_user?
end

# In Tasks::Start action:
authorize task, policy: TaskPolicy, query: :start?
```

**Impact:** Consistent with other actions, policy logic centralized, easier to test and maintain.

---

### 2.6 Improve SecretSanta::Enable Logic Flow

**Issue:** Redundant flash message and unclear control flow.

**File:** `src/actions/secret_santa/enable.cr:13-16`

**Current Code:**
```crystal
if existing
  flash.info = r("secret_santa.enabled").t
  redirect to: SecretSanta::Show.with(event.id)
end

# ... later
SaveSecretSanta.create(event_id: event.id) do |operation, secret_santa|
  if secret_santa
    flash.success = r("secret_santa.enabled").t  # Same message!
```

**Recommendation:**

Differentiate messages or restructure:

```crystal
existing = SecretSantaQuery.new.for_event(event).first?

if existing
  flash.info = r("secret_santa.already_enabled").t
  redirect to: SecretSanta::Show.with(event.id)
  return  # Make early return explicit
end

SaveSecretSanta.create(event_id: event.id) do |operation, secret_santa|
  if secret_santa
    flash.success = r("secret_santa.enabled").t
    redirect to: SecretSanta::Show.with(event.id)
  else
    flash.failure = r("errors.invalid").t
    redirect to: Events::Show.with(event.id)
  end
end
```

**Impact:** Clearer user feedback, better control flow readability.

---

### 2.7 Extract Common Guest Preloading Pattern

**Issue:** The pattern of loading a guest with preloaded event appears in multiple places.

**Files:**
- `src/actions/guests/check_in.cr:3-5`
- `src/actions/guests/undo_check_in.cr:3-5`

**Current Code:**
```crystal
guest = GuestQuery.new
  .preload_event
  .find(guest_id)
```

**Recommendation:**

Update `RequireGuestFromId` to support optional preloading:

```crystal
module RequireGuestFromId
  macro included
    include Rosetta::Translatable
    before enforce_guest_found

    @_guest : Guest?
  end

  # Override this to customize preloading
  private def guest_query
    GuestQuery.new
  end

  private def guest : Guest
    @_guest.not_nil!
  end

  private def enforce_guest_found
    guest_id = params.get(:guest_id).to_i64
    @_guest = guest_query.find(guest_id)
    continue
  rescue Avram::RecordNotFoundError
    flash.failure = r("guests.not_found").t
    redirect to: Me::Show
  end
end

# Usage in action:
class Guests::CheckIn < BrowserAction
  include RequireGuestFromId

  private def guest_query
    GuestQuery.new.preload_event
  end
end
```

**Impact:** More flexible mixin pattern, reduces duplication.

---

## 3. Query Layer Improvements

### 3.1 Add Semantic Query Methods

**Issue:** Some query combinations appear frequently and could be more semantic.

**Recommendation:**

Add to `EventQuery`:
```crystal
def with_creator_and_location
  preload_creator.preload_location
end

def for_user_with_preloads(user : User)
  for_user(user).with_creator_and_location
end
```

Add to `TaskQuery`:
```crystal
def with_full_context
  preload_event.preload_guest
end
```

**Impact:** More readable action code, self-documenting queries.

---

## 4. Test Coverage Improvements

### 4.1 Add Authorization Tests

**Issue:** No comprehensive authorization tests visible in the spec files reviewed.

**Recommendation:**

Create policy specs:
```crystal
# spec/policies/event_policy_spec.cr
describe EventPolicy do
  describe "#show?" do
    it "allows organizer to view event"
    it "allows invited guest to view event"
    it "denies non-invited user to view event"
  end

  describe "#update?" do
    it "allows organizer to update event"
    it "denies guest to update event"
  end
end
```

**Impact:** Ensures authorization logic is correct and doesn't regress.

---

## 5. Code Organization & Architecture

### 5.1 Consider Service Objects for Complex Operations

**Issue:** Some actions have complex business logic that could be extracted.

**Current State:**
- `Events::Show` loads multiple resources and performs weather API calls (62 lines)
- Mixing presentation logic with business logic

**Recommendation:**

Extract to service objects:

```crystal
# src/services/event_show_data_loader.cr
class EventShowDataLoader
  def initialize(@event : Event, @current_user : User)
  end

  def load
    {
      guests: load_guests,
      tasks: load_tasks,
      task_comments: load_task_comments,
      user_guest: find_user_guest,
      activities: load_activities,
      weather_forecast: load_weather_forecast
    }
  end

  private def load_guests
    GuestQuery.new
      .for_event(@event)
      .preload_user
      .results
  end

  # ... other methods
end

# In action:
data = EventShowDataLoader.new(event, current_user).load
html ShowPage, event: event, **data
```

**Impact:** Thinner actions, easier testing, better separation of concerns.

---

### 5.2 Extract Duplicate Event Lookup Logic in Guests::Rsvp

**Issue:** Event loading with preloading happens twice identically.

**File:** `src/actions/guests/rsvp.cr:8-11, 27-30`

**Current Code:**
```crystal
# Line 8-11
loaded_guest = GuestQuery.new
  .id(guest.id)
  .preload_event(EventQuery.new.preload_location)
  .first

# Line 27-30 (duplicate)
loaded_guest = GuestQuery.new
  .id(guest.id)
  .preload_event(EventQuery.new.preload_location)
  .first
```

**Recommendation:**

Extract to helper method:

```crystal
private def load_guest_with_event(guest : Guest)
  GuestQuery.new
    .id(guest.id)
    .preload_event(EventQuery.new.preload_location)
    .first
end

get "/guests/:guest_id/rsvp" do
  authorize guest, policy: GuestPolicy, query: :rsvp?
  loaded_guest = load_guest_with_event(guest)
  html RsvpPage, guest: loaded_guest
end

post "/guests/:guest_id/rsvp" do
  authorize guest, policy: GuestPolicy, query: :rsvp?

  SaveGuest.update(guest, params) do |operation, updated_guest|
    if operation.saved?
      flash.success = r("guests.rsvp_saved").t
      redirect to: Me::Show
    else
      flash.failure = r("guests.rsvp_failed").t
      loaded_guest = load_guest_with_event(guest)
      html RsvpPage, guest: loaded_guest, save_operation: operation
    end
  end
end
```

**Impact:** DRY, easier to maintain and modify preloading strategy.

---

## 6. Performance Considerations

### 6.1 Review N+1 Query Risks

**Issue:** In `Events::Show`, task comments are loaded in a loop.

**File:** `src/actions/events/show.cr:21-29`

**Current Code:**
```crystal
task_comments = {} of Int64 => Array(Comment)
tasks.each do |task|
  comments = CommentQuery.new
    .for_task(task)
    .preload_user
    .recent
    .results
  task_comments[task.id] = comments
end
```

**Recommendation:**

Load all comments at once:

```crystal
task_ids = tasks.map(&.id)
all_comments = CommentQuery.new
  .task_id.in(task_ids)
  .preload_user
  .recent
  .results

task_comments = all_comments.group_by(&.task_id)
```

**Impact:** Reduces N queries to 1 query, significant performance improvement for events with many tasks.

---

## 7. Code Quality & Consistency

### 7.1 Remove Backup Files

**Issue:** Backup files found in source directory.

**Files:**
- `src/actions/events/guests/rsvp.cr.bak`
- `src/actions/events/guests/invite.cr.bak`

**Recommendation:** Delete these files and ensure they're gitignored.

**Impact:** Cleaner codebase, avoid confusion.

---

### 7.2 Standardize HTTP Status Code Usage

**Issue:** In `Tasks::Complete` spec, using `be_ok` and `be_found` - ensure these are correct expectations.

**File:** `spec/actions/tasks/complete_spec.cr:13, 22, 40`

**Recommendation:** Review and ensure status codes match intended behavior:
- GET should return 200 OK for successful display
- POST should return 302 Found for successful redirect
- Consider 303 See Other for POST-redirect-GET pattern

**Impact:** Better HTTP semantics, clearer test intentions.

---

## 8. Security Considerations

### 8.1 Review Authorization on All Actions

**Recommendation:** Conduct a comprehensive audit to ensure all actions have appropriate authorization:

1. List all actions without explicit authorization calls
2. Verify each action either:
   - Calls `authorize` with appropriate policy
   - Includes `Auth::AllowGuests` intentionally
   - Is an authentication-related action (sign in/out/up)

**Impact:** Prevents unauthorized access, ensures secure application.

---

### 8.2 Add Policy Tests for Edge Cases

**Recommendation:** Test authorization edge cases:

- User tries to access deleted/non-existent resources
- User tries to access resources after permissions change
- Concurrent access scenarios
- Guest status changes (confirmed → declined)

**Impact:** More robust security posture.

---

## Implementation Priority

### High Priority (Security & Correctness)
1. **2.4** - Fix hardcoded French string in `guests/undo_check_in.cr`
2. **2.6** - Replace manual authorization in `Tasks::Start`
3. **8.1** - Security audit of all actions
4. **7.1** - Remove backup files

### Medium Priority (Code Quality & Maintainability)
1. **1.1** - Extract common policy helpers
2. **2.1** - Standardize SecretSanta authorization
3. **2.2** - Extract common event loading pattern
4. **2.3** - Extract confirmed guests pattern
5. **2.5** - Fix RequireEventFromId inconsistency
6. **5.2** - Fix duplicate loading in Guests::Rsvp
7. **2.4** - Standardize all flash messages to i18n

### Low Priority (Nice to Have)
1. **1.2** - Fix variable naming in SecretSantaAssignmentPolicy
2. **2.7** - Improve SecretSanta::Enable flow
3. **2.8** - Enhance RequireGuestFromId flexibility
4. **3.1** - Add semantic query methods
5. **5.1** - Consider service objects for complex actions
6. **6.1** - Optimize N+1 queries in Events::Show
7. **4.1** - Add comprehensive policy tests

---

## Estimated Impact

### Lines of Code Reduction
- Policy helpers extraction: ~50 lines
- Action mixins: ~100 lines
- Query helper methods: ~80 lines
- **Total: ~230 lines** removed through DRY principles

### Maintainability Improvements
- Centralized authorization logic
- Consistent error handling patterns
- Easier to add new features
- Better test coverage

### Performance Improvements
- N+1 query optimization in Events::Show
- More efficient query patterns

---

## Next Steps

1. **Review this plan** with the team
2. **Prioritize** items based on business needs
3. **Create tickets** for each refactoring item
4. **Implement incrementally** - don't try to do everything at once
5. **Test thoroughly** after each change
6. **Document patterns** for new developers

---

## Conclusion

The Fiesta application has a solid foundation with good use of Lucky framework patterns. The identified improvements focus on:

- **Reducing duplication** through shared modules and mixins
- **Improving consistency** in authorization and error handling
- **Enhancing i18n support** by removing hardcoded strings
- **Optimizing performance** through better query patterns
- **Strengthening security** through comprehensive authorization coverage

Implementing these recommendations will result in a more maintainable, performant, and secure codebase.
