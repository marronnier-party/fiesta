# Fiesta - Future Improvements Plan

This document contains deferred and unimplemented items from the main refactoring plan. These items are lower priority or require larger architectural changes.

**Status:** Not Yet Implemented
**Created:** 2025-10-01
**Source:** Extracted from REFACTORING_PLAN.md

---

## 1. Test Coverage Improvements

### 1.1 Add Comprehensive Authorization Tests

**Priority:** Medium
**Effort:** Medium
**Status:** ⏸️ DEFERRED

**Issue:** No comprehensive authorization tests visible in the spec files reviewed.

**Recommendation:**

Create policy specs for all policy classes:

```crystal
# spec/policies/event_policy_spec.cr
describe EventPolicy do
  describe "#show?" do
    it "allows organizer to view event" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      policy = EventPolicy.new(organizer, event)

      policy.show?.should be_true
    end

    it "allows invited guest to view event" do
      user = UserFactory.create
      event = EventFactory.create
      GuestFactory.create &.event_id(event.id).user_id(user.id)
      policy = EventPolicy.new(user, event)

      policy.show?.should be_true
    end

    it "denies non-invited user to view event" do
      user = UserFactory.create
      event = EventFactory.create
      policy = EventPolicy.new(user, event)

      policy.show?.should be_false
    end
  end

  describe "#update?" do
    it "allows organizer to update event" do
      organizer = UserFactory.create
      event = EventFactory.create &.creator_id(organizer.id)
      policy = EventPolicy.new(organizer, event)

      policy.update?.should be_true
    end

    it "denies guest to update event" do
      user = UserFactory.create
      event = EventFactory.create
      GuestFactory.create &.event_id(event.id).user_id(user.id)
      policy = EventPolicy.new(user, event)

      policy.update?.should be_false
    end
  end
end

# Similarly for:
# - spec/policies/task_policy_spec.cr
# - spec/policies/guest_policy_spec.cr
# - spec/policies/secret_santa_policy_spec.cr
# - spec/policies/secret_santa_assignment_policy_spec.cr
```

**Impact:**
- Ensures authorization logic is correct and doesn't regress
- Catches edge cases in authorization
- Makes it safer to refactor policies
- Documents expected authorization behavior

**Estimated Effort:** 2-3 days for comprehensive coverage

---

### 1.2 Add Policy Tests for Edge Cases

**Priority:** Medium
**Effort:** Medium
**Status:** ⏸️ DEFERRED

**Recommendation:** Test authorization edge cases that might not be covered by regular specs:

**Edge Cases to Test:**

1. **Deleted/Non-existent Resources**
   ```crystal
   it "denies access when event is deleted" do
     user = UserFactory.create
     event = EventFactory.create &.creator_id(user.id)
     event_id = event.id
     event.delete

     # Action should handle gracefully
     response = ApiClient.auth(user).get(Events::Show.with(event_id))
     response.status.should eq(HTTP::Status::NOT_FOUND)
   end
   ```

2. **Permission Changes**
   ```crystal
   it "denies access after guest is removed" do
     user = UserFactory.create
     event = EventFactory.create
     guest = GuestFactory.create &.event_id(event.id).user_id(user.id)

     # User can access initially
     policy = EventPolicy.new(user, event)
     policy.show?.should be_true

     # Remove guest
     guest.delete

     # User can no longer access
     policy = EventPolicy.new(user, event)
     policy.show?.should be_false
   end
   ```

3. **Guest Status Changes**
   ```crystal
   it "adjusts permissions when guest status changes from confirmed to declined" do
     user = UserFactory.create
     event = EventFactory.create
     guest = GuestFactory.create &.event_id(event.id).user_id(user.id).status(:confirmed)

     policy = EventPolicy.new(user, event)
     policy.confirmed_guest?.should be_true

     # Change to declined
     SaveGuest.update!(guest, status: Guest::Status::Declined)

     policy = EventPolicy.new(user, event)
     policy.confirmed_guest?.should be_false
   end
   ```

4. **Nil/Missing Associations**
   ```crystal
   it "handles task without assigned guest" do
     user = UserFactory.create
     task = TaskFactory.create # No guest assigned
     policy = TaskPolicy.new(user, task)

     policy.complete?.should be_false
   end
   ```

**Impact:** More robust security posture, catches edge cases that could lead to security vulnerabilities.

**Estimated Effort:** 1-2 days

---

### 1.3 Fix Pre-existing Test Failures

**Priority:** High
**Effort:** High
**Status:** Not Started

**Issue:** The test suite has 59 failures and 57 errors (329 total examples). These were confirmed to be pre-existing before the refactoring.

**Key Failures:**
- `Tasks::Complete` spec failures (BAD_REQUEST instead of expected responses)
- Various flow spec failures
- Service spec failures

**Recommendation:**

1. **Investigate and Fix Tasks::Complete Failures**
   - Failing specs at lines 5, 48, 60, 76, 88
   - Returns BAD_REQUEST (400) instead of expected OK/FOUND
   - Likely authorization or data setup issue

2. **Review and Fix Flow Spec Failures**
   - Event check-in flow
   - Task management flow
   - Complete event lifecycle flow
   - Guest invitation and RSVP flows
   - Secret Santa flow

3. **Fix Service Spec Failures**
   - WeatherService specs
   - NotificationService specs
   - ICalendarService specs

**Approach:**
1. Run each failing spec individually with `--error-trace`
2. Identify root causes (data setup, authorization, missing fields, etc.)
3. Fix systematically, starting with unit tests before integration tests
4. Ensure no regressions

**Impact:**
- Green test suite
- Confidence in codebase correctness
- Easier to catch future regressions

**Estimated Effort:** 5-7 days (significant investigation required)

---

## 2. Code Quality & Consistency

### 2.1 Standardize HTTP Status Code Usage

**Priority:** Low
**Effort:** Low
**Status:** ⏸️ DEFERRED

**Issue:** Review HTTP status codes used throughout the application for semantic correctness.

**Current State:**
- Mix of 302 Found, 303 See Other for redirects
- Some specs expect specific status codes that might not be semantically correct

**Recommendation:**

Review and standardize:

1. **GET requests** → 200 OK for successful display
2. **POST-Redirect-GET pattern** → Consider 303 See Other instead of 302 Found
3. **Failed form submissions** → 422 Unprocessable Entity with form re-render
4. **Authorization failures** → 403 Forbidden (already implemented)
5. **Not found** → 404 Not Found (already implemented)

**Example:**
```crystal
# Current pattern (302 Found)
redirect to: Me::Show

# Consider using 303 See Other for POST-redirect-GET
redirect to: Me::Show, status: HTTP::Status::SEE_OTHER
```

**Impact:**
- Better HTTP semantics
- Clearer intent in code and tests
- Better browser cache behavior

**Estimated Effort:** 1-2 days

---

## 3. Security & Authorization

### 3.1 Comprehensive Authorization Audit

**Priority:** High
**Effort:** High
**Status:** ⏸️ DEFERRED (Separate task beyond refactoring scope)

**Recommendation:** Conduct a comprehensive security audit to ensure all actions have appropriate authorization.

**Audit Process:**

1. **List All Actions**
   ```bash
   find src/actions -name "*.cr" -not -path "*/mixins/*" | sort
   ```

2. **For Each Action, Verify:**
   - Has explicit `authorize` call, OR
   - Includes `Auth::AllowGuests` intentionally, OR
   - Is an authentication-related action (SignIn, SignUp, SignOut, etc.)

3. **Create Authorization Matrix**

   | Action | Resource | Authorization | Notes |
   |--------|----------|---------------|-------|
   | Events::Show | Event | ✅ authorize | Checks guest/organizer |
   | Events::Update | Event | ✅ authorize | Organizer only |
   | Tasks::Complete | Task | ✅ authorize | Assigned user only |
   | ... | ... | ... | ... |

4. **Flag Concerns:**
   - Actions without authorization
   - Actions with manual checks that should use policies
   - Inconsistent authorization patterns

5. **Test Each Authorization Path:**
   - Organizer access
   - Guest access (confirmed vs declined)
   - Non-invited user access
   - Unauthenticated access

**Impact:**
- Prevents unauthorized access
- Ensures secure application
- Documents authorization intent

**Estimated Effort:** 3-5 days for full audit and fixes

---

### 3.2 Add Authorization Logging and Monitoring

**Priority:** Medium
**Effort:** Medium
**Status:** Not Started

**Recommendation:** Add logging for authorization failures to detect potential security issues or bugs.

```crystal
# In ApplicationPolicy or a concern
def log_authorization_failure(action : String)
  Log.warn {
    "Authorization failed: user=#{user.try(&.id)} " \
    "action=#{action} " \
    "resource=#{record.class.name}:#{record.id}"
  }
end

# Usage in policies:
def update?
  result = organizer?
  log_authorization_failure("update") unless result
  result
end
```

**Impact:**
- Visibility into authorization patterns
- Detect potential attacks or bugs
- Audit trail for security review

**Estimated Effort:** 1 day

---

## 4. Architecture & Design

### 4.1 Extract Service Objects for Complex Operations

**Priority:** Low
**Effort:** High
**Status:** ⏸️ DEFERRED (Larger architectural change)

**Issue:** Some actions have complex business logic that could be extracted to service objects for better testability and reusability.

**Candidates for Service Objects:**

1. **Events::Show Data Loading**

   Current state: 62 lines with multiple queries and external API calls

   **Proposed Service:**
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
         weather_forecast: load_weather_forecast,
       }
     end

     private def load_guests
       GuestQuery.new
         .for_event(@event)
         .preload_user
         .results
     end

     private def load_tasks
       TaskQuery.new
         .for_event(@event)
         .with_full_context
         .results
     end

     private def load_task_comments
       task_ids = @tasks.map(&.id)
       all_comments = CommentQuery.new
         .commentable_type("Task")
         .commentable_id.in(task_ids)
         .preload_user
         .recent
         .results
       all_comments.group_by(&.commentable_id)
     end

     private def find_user_guest
       GuestQuery.new
         .for_event(@event)
         .user_id(@current_user.id)
         .first?
     end

     private def load_activities
       ActivityQuery.new
         .for_event(@event)
         .preload_user
         .recent
         .limit(50)
         .results
     end

     private def load_weather_forecast
       return nil unless @event.location_id && @event.start_at

       location = @event.location
       WeatherService.get_forecast(
         location.latitude,
         location.longitude,
         @event.start_at.not_nil!
       )
     rescue
       nil
     end
   end

   # In action:
   class Events::Show < BrowserAction
     include RequireEventFromId

     get "/events/:event_id" do
       authorize event, policy: EventPolicy, query: :show?

       data = EventShowDataLoader.new(event, current_user).load
       html ShowPage, event: event, **data
     end
   end
   ```

2. **SecretSanta::Randomize Assignment Logic**

   Complex algorithm that could be a service:
   ```crystal
   # src/services/secret_santa_assignment_service.cr
   class SecretSantaAssignmentService
     def initialize(@secret_santa : SecretSanta)
     end

     def create_assignments : Bool
       participants = load_participants
       return false if participants.size < 2

       assignments = generate_circular_assignments(participants)
       save_assignments(assignments)
     end

     private def load_participants
       GuestQuery.new
         .for_event(@secret_santa.event)
         .confirmed
         .results
         .shuffle
     end

     private def generate_circular_assignments(participants)
       # Complex circular assignment logic
     end

     private def save_assignments(assignments)
       # Save logic
     end
   end
   ```

**Benefits:**
- Thinner action classes
- Easier unit testing (no HTTP context needed)
- Reusable business logic
- Better separation of concerns

**Drawbacks:**
- More files to maintain
- Additional abstraction layer
- May be premature optimization for some cases

**Impact:** Better code organization, easier testing, but requires significant refactoring.

**Estimated Effort:** 3-5 days for initial extraction, ongoing for new features

---

### 4.2 Consider Background Job System

**Priority:** Medium
**Effort:** High
**Status:** Not Started

**Issue:** Some operations could benefit from background processing:
- Sending notification emails
- Processing weather forecasts
- Generating calendar exports

**Recommendation:**

Evaluate and potentially integrate a background job system:

1. **Options:**
   - [Mosquito](https://github.com/mosquito-cr/mosquito) - Crystal background job processor
   - [Sidekiq.cr](https://github.com/mperham/sidekiq.cr) - Crystal client for Sidekiq

2. **Use Cases:**
   ```crystal
   # Process pending notifications asynchronously
   class ProcessNotificationsJob < Mosquito::QueuedJob
     def perform
       NotificationService.process_pending_notifications
     end
   end

   # Schedule recurring job
   Mosquito::PeriodicJob.define(
     name: "process_notifications",
     schedule: "*/5 * * * *" # Every 5 minutes
   ) do
     ProcessNotificationsJob.new.enqueue
   end
   ```

**Impact:**
- Better performance for long-running operations
- Improved user experience
- Better resource utilization

**Estimated Effort:** 3-5 days for setup and migration

---

## 5. Documentation

### 5.1 Document Authorization Patterns

**Priority:** Medium
**Effort:** Low
**Status:** Not Started

**Recommendation:** Create documentation for authorization patterns to help new developers.

**Proposed Document:** `docs/AUTHORIZATION.md`

```markdown
# Authorization in Fiesta

## Overview
Fiesta uses [Pundit](https://github.com/stephendolan/pundit) for authorization...

## Creating a New Policy

1. Create policy file in `src/policies/`
2. Inherit from `ApplicationPolicy(YourModel)`
3. Include appropriate concern module
4. Define authorization methods

## Using Policies in Actions

```crystal
class YourAction < BrowserAction
  get "/resource/:id" do
    authorize resource, policy: YourPolicy, query: :show?
    # ... rest of action
  end
end
```

## Common Patterns

### Event-based Authorization
Use `EventRelatedAuthorizationHelpers` for models with event association...

### Custom Authorization Logic
Override methods in your policy...

## Testing Policies
[Examples of policy tests]
```

**Impact:** Easier onboarding, consistent patterns, reduced confusion.

**Estimated Effort:** 1 day

---

### 5.2 Create Development Setup Guide

**Priority:** High
**Effort:** Low
**Status:** Not Started

**Recommendation:** Document the development setup process.

**Proposed Document:** `docs/DEVELOPMENT.md`

Topics to cover:
- Installing Crystal and dependencies
- Database setup (PostgreSQL)
- Running migrations
- Running the test suite
- Running the development server
- Environment variables
- Common development tasks
- Troubleshooting

**Impact:** Faster onboarding, fewer setup issues.

**Estimated Effort:** 1 day

---

## 6. Performance & Optimization

### 6.1 Add Database Indexes Review

**Priority:** Medium
**Effort:** Medium
**Status:** Not Started

**Recommendation:** Review database queries and add appropriate indexes.

**Process:**

1. **Enable Query Logging:**
   ```crystal
   Avram::QueryLog.dexter_mode!
   ```

2. **Identify Slow Queries:**
   - Review production logs
   - Use database `EXPLAIN ANALYZE`
   - Monitor query performance

3. **Add Indexes:**
   ```crystal
   # Example migration
   def migrate
     add_index :guests, [:event_id, :user_id], unique: true
     add_index :tasks, :event_id
     add_index :tasks, :guest_id
     add_index :comments, [:commentable_type, :commentable_id]
   end
   ```

4. **Common Index Candidates:**
   - Foreign keys (event_id, user_id, etc.)
   - Frequently queried columns (status, confirmed, etc.)
   - Compound indexes for common query patterns

**Impact:**
- Faster query performance
- Better scalability
- Reduced database load

**Estimated Effort:** 2-3 days

---

### 6.2 Review and Optimize Asset Pipeline

**Priority:** Low
**Effort:** Medium
**Status:** Not Started

**Recommendation:** Review frontend asset loading and optimization.

**Areas to Review:**
- JavaScript bundle size
- CSS optimization
- Image optimization
- Lazy loading
- Caching strategy

**Impact:** Faster page loads, better user experience.

**Estimated Effort:** 2-3 days

---

## Implementation Priority

### Critical (Do First)
1. **3.1** - Comprehensive authorization audit
2. **1.3** - Fix pre-existing test failures
3. **5.2** - Development setup documentation

### High Priority
1. **1.1** - Add comprehensive authorization tests
2. **6.1** - Database indexes review
3. **5.1** - Document authorization patterns

### Medium Priority
1. **1.2** - Add policy edge case tests
2. **3.2** - Add authorization logging
3. **4.2** - Consider background job system
4. **2.1** - Standardize HTTP status codes

### Low Priority
1. **4.1** - Extract service objects (case-by-case basis)
2. **6.2** - Optimize asset pipeline

---

## Notes

- These items were deferred during the main refactoring to keep scope manageable
- Some items (like service object extraction) should be evaluated on a case-by-case basis
- Security-related items (authorization audit, tests) should be prioritized
- Test failures should be addressed before new feature development

**Last Updated:** 2025-10-01
