# htmx 2.0 + Alpine.js Integration Plan for Fiesta

## Overview
This plan details the integration of htmx 2.0 and Alpine.js into the Fiesta event management application to enhance interactivity while maintaining the server-rendered Lucky Framework architecture.

**This plan builds on your existing UI component system** (19 components already implemented in `src/components/ui/`) and integrates htmx/Alpine features directly into them.

## Table of Contents
1. [Installation & Setup](#1-installation--setup)
2. [Core Infrastructure](#2-core-infrastructure)
3. [Enhancing Existing UI Components](#3-enhancing-existing-ui-components)
4. [Feature Implementations](#4-feature-implementations)
5. [Advanced Features](#5-advanced-features)
6. [Testing Strategy](#6-testing-strategy)
7. [Performance Optimizations](#7-performance-optimizations)

---

## 1. Installation & Setup

### 1.1 Update Dependencies
```bash
yarn remove htmx turbolinks  # Remove old htmx and turbolinks
yarn add htmx.org@2.0.4 alpinejs@^3.14.1
```

### 1.2 Update JavaScript Entry Point
**File: `src/js/app.js`**

Replace current content with:
```javascript
/* eslint no-console:0 */

// Rails UJS - Required for DELETE, POST, PUT links
import Rails from "@rails/ujs";
Rails.start();

// htmx 2.0
import htmx from 'htmx.org';
window.htmx = htmx;

// Alpine.js
import Alpine from 'alpinejs';
window.Alpine = Alpine;
Alpine.start();

// Custom htmx configuration
htmx.config.historyCacheSize = 20;
htmx.config.timeout = 30000;
htmx.config.refreshOnHistoryMiss = true;

// Global htmx event handlers
document.body.addEventListener('htmx:configRequest', (event) => {
  // Add CSRF token to all htmx requests
  const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrf) {
    event.detail.headers['X-CSRF-Token'] = csrf;
  }
});

// Show loading indicators
document.body.addEventListener('htmx:beforeRequest', (event) => {
  const indicator = event.target.querySelector('.htmx-indicator');
  if (indicator) indicator.classList.remove('hidden');
});

document.body.addEventListener('htmx:afterRequest', (event) => {
  const indicator = event.target.querySelector('.htmx-indicator');
  if (indicator) indicator.classList.add('hidden');
});

// Error handling with toast notification
document.body.addEventListener('htmx:responseError', (event) => {
  console.error('htmx error:', event.detail);
  window.dispatchEvent(new CustomEvent('add-toast', {
    detail: {
      message: 'An error occurred. Please try again.',
      type: 'error'
    }
  }));
});

// Success notification on common actions
document.body.addEventListener('htmx:afterSwap', (event) => {
  const successMessage = event.detail.xhr.getResponseHeader('X-Success-Message');
  if (successMessage) {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        message: successMessage,
        type: 'success'
      }
    }));
  }
});
```

### 1.3 Update Layout Head
**File: `src/components/shared/layout_head.cr`**

Remove the unpkg CDN link for htmx:
```crystal
class Shared::LayoutHead < BaseComponent
  needs page_title : String

  def render
    head do
      utf8_charset
      title "Marronnier.party - #{@page_title}"
      css_link asset("css/app.css")
      js_link asset("js/app.js"), defer: "true"
      csrf_meta_tags
      responsive_meta_tag

      # Development helper
      live_reload_connect_tag if LuckyEnv.development?
    end
  end
end
```

### 1.4 Update Build Scripts (Using Bun)
Ensure `package.json` scripts use Bun for faster builds:
```json
"scripts": {
  "build:js": "bun build src/js/app.js --outfile=public/js/app.js --sourcemap=inline --target=browser",
  "watch:js": "bun build src/js/app.js --outfile=public/js/app.js --watch --sourcemap=inline --target=browser",
  "build:css": "tailwindcss --postcss --input=src/css/app.css --output=public/css/app.css",
  "watch:css": "tailwindcss --postcss --watch --input=src/css/app.css --output=public/css/app.css",
  "dev": "bun run watch:js & bun run watch:css",
  "build": "bun run build:js && bun run build:css"
}
```

**Note**: This project uses **Bun** instead of yarn/npm for faster JavaScript builds (6ms vs 350ms+).

---

## 2. Core Infrastructure

### 2.1 Create Alpine Component Store
**File: `src/js/alpine/components.js`**

```javascript
// Notification system
export const notification = () => ({
  visible: false,
  message: '',
  type: 'info', // 'success', 'error', 'warning', 'info'

  show(message, type = 'info') {
    this.message = message;
    this.type = type;
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
    }, 5000);
  },

  hide() {
    this.visible = false;
  }
});

// Modal system
export const modal = () => ({
  open: false,

  toggle() {
    this.open = !this.open;
  },

  close() {
    this.open = false;
  }
});

// Dropdown system
export const dropdown = () => ({
  open: false,

  toggle() {
    this.open = !this.open;
  },

  close() {
    this.open = false;
  }
});

// Tabs system
export const tabs = (defaultTab = 0) => ({
  activeTab: defaultTab,

  setTab(index) {
    this.activeTab = index;
  },

  isActive(index) {
    return this.activeTab === index;
  }
});

// Collapsible sections
export const collapsible = (initialState = false) => ({
  expanded: initialState,

  toggle() {
    this.expanded = !this.expanded;
  }
});
```

Update `src/js/app.js` to include:
```javascript
import * as components from './alpine/components';

// Register Alpine components
Alpine.data('notification', components.notification);
Alpine.data('modal', components.modal);
Alpine.data('dropdown', components.dropdown);
Alpine.data('tabs', components.tabs);
Alpine.data('collapsible', components.collapsible);

Alpine.start();
```

### 2.2 Create htmx Helper Module for Lucky
**File: `src/helpers/htmx_helper.cr`**

```crystal
module HtmxHelper
  # Add htmx attributes to HTML elements
  def hx_get(url : String)
    {"hx-get" => url}
  end

  def hx_post(url : String)
    {"hx-post" => url}
  end

  def hx_put(url : String)
    {"hx-put" => url}
  end

  def hx_delete(url : String)
    {"hx-delete" => url}
  end

  def hx_trigger(event : String)
    {"hx-trigger" => event}
  end

  def hx_target(selector : String)
    {"hx-target" => selector}
  end

  def hx_swap(strategy : String)
    {"hx-swap" => strategy}
  end

  def hx_indicator(selector : String)
    {"hx-indicator" => selector}
  end

  def hx_vals(hash : Hash)
    {"hx-vals" => hash.to_json}
  end

  # Combine multiple htmx attributes
  def hx_attrs(**attrs)
    result = {} of String => String
    attrs.each do |key, value|
      hx_key = "hx-#{key.to_s.gsub('_', '-')}"
      result[hx_key] = value.to_s
    end
    result
  end

  # Check if request is from htmx
  def htmx_request?
    context.request.headers["HX-Request"]? == "true"
  end

  # Get htmx trigger element
  def htmx_trigger
    context.request.headers["HX-Trigger"]?
  end

  # Get current URL from htmx
  def htmx_current_url
    context.request.headers["HX-Current-URL"]?
  end

  # Respond with htmx-specific headers
  def htmx_redirect(url : String)
    context.response.headers["HX-Redirect"] = url
  end

  def htmx_refresh
    context.response.headers["HX-Refresh"] = "true"
  end

  def htmx_trigger_event(event_name : String, detail : Hash? = nil)
    if detail
      context.response.headers["HX-Trigger"] = {event_name => detail}.to_json
    else
      context.response.headers["HX-Trigger"] = event_name
    end
  end
end

# Include in actions
abstract class BrowserAction < Lucky::Action
  include HtmxHelper
end

abstract class ApiAction < Lucky::Action
  include HtmxHelper
end
```

### 2.3 Create Loading Indicator Component
**File: `src/components/ui/loading_spinner.cr`**

```crystal
class UI::LoadingSpinner < BaseComponent
  needs size : String = "md" # sm, md, lg
  needs classes : String = ""
  needs show_by_default : Bool = false

  def render
    size_class = case @size
    when "sm"
      "w-4 h-4"
    when "lg"
      "w-12 h-12"
    else
      "w-8 h-8"
    end

    visibility = show_by_default ? "" : "hidden"

    span class: "loading loading-spinner #{size_class} #{@classes} htmx-indicator #{visibility}"
  end
end
```

### 2.4 Update BaseComponent to Include Helpers
**File: `src/components/base_component.cr`**

```crystal
abstract class BaseComponent < Lucky::BaseComponent
  include Rosetta::Translatable
  include DateFormatHelper
  include HtmxHelper  # Add this line

  # Helper macro to render icons easily
  macro icon(icon_name, icon_classes = "w-4 h-4")
    mount UI::Icon, name: {{icon_name}}, classes: {{icon_classes}}
  end
end
```

---

## 3. Enhancing Existing UI Components

### 3.1 Enhanced UI::Card with htmx Loading States
**File: `src/components/ui/card.cr`**

```crystal
class UI::Card < BaseComponent
  needs title : String? = nil
  needs title_class : String = "card-title"
  needs body_padding : Bool = true
  needs htmx_indicator : Bool = false
  needs id : String? = nil

  def render(&)
    attrs = {} of String => String
    attrs["id"] = id if id

    div class: "card bg-base-100 shadow-xl", **attrs do
      if htmx_indicator
        div class: "absolute top-2 right-2" do
          mount UI::LoadingSpinner, size: "sm"
        end
      end

      div class: card_body_class do
        if title
          h2 title, class: title_class
        end
        yield
      end
    end
  end

  private def card_body_class
    body_padding ? "card-body" : "card-body p-0"
  end
end
```

### 3.2 Enhanced UI::FormInput with Alpine Validation
**File: `src/components/ui/form_input.cr`**

```crystal
class UI::FormInput < BaseComponent
  needs label_text : String
  needs name : String
  needs value : String? = nil
  needs placeholder : String? = nil
  needs input_type : String = "text"
  needs required : Bool = false
  needs hint : String? = nil
  needs alpine_model : String? = nil
  needs alpine_validation : String? = nil
  needs autofocus : Bool = false

  def render
    div class: "form-control" do
      label label_text, class: "label font-semibold"

      attrs = build_attributes

      input **attrs

      if hint_text = hint
        label class: "label" do
          span hint_text, class: "label-text-alt"
        end
      end

      # Show validation error if Alpine validation is enabled
      if alpine_validation
        div "x-show": alpine_validation,
            "x-transition",
            class: "label" do
          span "x-text": alpine_validation,
               class: "label-text-alt text-error"
        end
      end
    end
  end

  private def build_attributes
    attrs = {
      "type" => input_type,
      "name" => name,
      "value" => value.to_s,
      "class" => "input input-bordered w-full"
    } of String => String

    attrs["placeholder"] = placeholder if placeholder
    attrs["required"] = "true" if required
    attrs["autofocus"] = "true" if autofocus
    attrs["x-model"] = alpine_model if alpine_model

    attrs
  end
end
```

### 3.3 Enhanced UI::Button with htmx Support
**File: `src/components/ui/button.cr`**

```crystal
class UI::Button < BaseComponent
  needs text : String
  needs variant : String = "primary"
  needs size : String = "md"
  needs icon_name : String? = nil
  needs icon_position : String = "left"
  needs disabled : Bool = false
  needs type : String = "button"
  needs classes : String = ""
  needs loading : Bool = false
  needs hx_attributes : Hash(String, String) = {} of String => String

  def render(&)
    all_attrs = {
      "type" => type,
      "class" => button_classes,
      "disabled" => "true"
    } of String => String

    # Remove disabled if not disabled
    all_attrs.delete("disabled") unless disabled || loading

    # Add htmx attributes
    all_attrs.merge!(hx_attributes)

    button **all_attrs do
      if loading
        mount UI::LoadingSpinner, size: button_spinner_size, classes: "mr-2"
      elsif icon_name && icon_position == "left"
        icon icon_name, icon_size_class + " mr-2"
      end

      text text

      if icon_name && icon_position == "right" && !loading
        icon icon_name, icon_size_class + " ml-2"
      end

      yield if block_given?
    end
  end

  def render
    render { }
  end

  private def button_classes
    base = "btn"
    variant_class = "btn-#{variant}" unless variant == "default"
    size_class = "btn-#{size}" unless size == "md"

    [base, variant_class, size_class, classes].compact.reject(&.empty?).join(" ")
  end

  private def icon_size_class
    case size
    when "xs"
      "w-3 h-3"
    when "sm"
      "w-4 h-4"
    when "lg"
      "w-6 h-6"
    else
      "w-5 h-5"
    end
  end

  private def button_spinner_size
    case size
    when "xs", "sm"
      "sm"
    when "lg"
      "md"
    else
      "md"
    end
  end
end
```

### 3.4 Create UI::Modal Component with Alpine
**File: `src/components/ui/modal.cr`**

```crystal
class UI::Modal < BaseComponent
  needs id : String
  needs title : String
  needs size : String = "md" # sm, md, lg, xl
  needs closeable : Bool = true
  needs open_by_default : Bool = false

  def render(&)
    div "x-data": "{ open: #{open_by_default} }",
        "x-show": "open",
        "@open-modal-#{id}.window": "open = true",
        "@close-modal-#{id}.window": "open = false",
        "@keydown.escape.window": closeable ? "open = false" : "",
        "x-cloak": !open_by_default,
        class: "fixed inset-0 z-50 overflow-y-auto",
        style: open_by_default ? "" : "display: none;" do

      # Backdrop
      div "x-show": "open",
          "@click": closeable ? "open = false" : "",
          "x-transition:enter": "transition ease-out duration-300",
          "x-transition:enter-start": "opacity-0",
          "x-transition:enter-end": "opacity-100",
          "x-transition:leave": "transition ease-in duration-200",
          "x-transition:leave-start": "opacity-100",
          "x-transition:leave-end": "opacity-0",
          class: "fixed inset-0 bg-black bg-opacity-50"

      # Modal content
      div "x-show": "open",
          "x-transition:enter": "transition ease-out duration-300",
          "x-transition:enter-start": "opacity-0 scale-90",
          "x-transition:enter-end": "opacity-100 scale-100",
          "x-transition:leave": "transition ease-in duration-200",
          "x-transition:leave-start": "opacity-100 scale-100",
          "x-transition:leave-end": "opacity-0 scale-90",
          "@click.away": closeable ? "open = false" : "",
          class: "relative flex items-center justify-center min-h-screen p-4" do

        div class: "card bg-base-100 shadow-xl w-full max-w-#{size}" do
          div class: "card-body" do
            div class: "flex items-center justify-between mb-4" do
              h3 title, class: "card-title"

              if closeable
                button "@click": "open = false",
                       class: "btn btn-sm btn-circle btn-ghost" do
                  icon "x", "w-4 h-4"
                end
              end
            end

            # Modal content
            yield
          end
        end
      end
    end
  end
end

# Helper to trigger modal from anywhere
# JavaScript: window.dispatchEvent(new CustomEvent('open-modal-my-modal'))
```

### 3.5 Create UI::ToastContainer Component
**File: `src/components/ui/toast_container.cr`**

```crystal
class UI::ToastContainer < BaseComponent
  def render
    div id: "toast-container",
        "x-data": "{ toasts: [] }",
        "@add-toast.window": "toasts.push($event.detail); setTimeout(() => toasts.shift(), 5000)",
        class: "fixed top-4 right-4 z-50 space-y-2 max-w-sm" do

      tag "template", "x-for": "(toast, index) in toasts", ":key": "index" do
        div "x-show": "true",
            "x-transition:enter": "transition ease-out duration-300 transform",
            "x-transition:enter-start": "translate-x-full opacity-0",
            "x-transition:enter-end": "translate-x-0 opacity-100",
            "x-transition:leave": "transition ease-in duration-200 transform",
            "x-transition:leave-start": "translate-x-0 opacity-100",
            "x-transition:leave-end": "translate-x-full opacity-0",
            class: "alert shadow-lg",
            ":class": "{
              'alert-success': toast.type === 'success',
              'alert-error': toast.type === 'error',
              'alert-warning': toast.type === 'warning',
              'alert-info': toast.type === 'info'
            }" do
          span "x-text": "toast.message"
          button "@click": "toasts.splice(index, 1)",
                 class: "btn btn-sm btn-ghost btn-circle" do
            text "✕"
          end
        end
      end
    end
  end
end
```

**Add to MainLayout** (`src/pages/main_layout.cr`):
```crystal
def render
  html_doctype
  html lang: "en" do
    mount Shared::LayoutHead, page_title: page_title
    body class: "min-h-screen bg-base-200" do
      mount Shared::Navbar, current_user: current_user
      mount Shared::FlashMessages, context.flash
      mount UI::ToastContainer  # Add this line

      main class: "container mx-auto px-4 py-8 max-w-7xl" do
        content
      end
      render_footer
    end
  end
end
```

---

## 4. Feature Implementations

### 4.1 Inline Guest Status Updates with htmx

**Create partial component:**
**File: `src/components/guests/guest_row.cr`**

```crystal
class Guests::GuestRow < BaseComponent
  needs guest : Guest
  needs current_user : User
  needs is_organizer : Bool

  def render
    div id: "guest-#{guest.id}",
        class: "flex items-center justify-between p-3 bg-base-200 rounded-lg" do

      div class: "flex items-center gap-3" do
        mount UI::Avatar, user: guest.user!, size: "md"

        div do
          div guest.user!.name, class: "font-semibold"
          if guest.guest_count > 1
            small "(+#{guest.guest_count - 1})", class: "text-sm text-base-content/60"
          end
        end
      end

      # Status controls with htmx
      div class: "flex items-center gap-2" do
        mount UI::StatusBadge, status: guest.status

        if is_organizer
          render_status_controls
        end
      end
    end
  end

  private def render_status_controls
    div class: "dropdown dropdown-end", "x-data": "dropdown" do
      button class: "btn btn-sm btn-ghost", "@click": "toggle()" do
        icon "edit", "w-4 h-4"
      end

      div class: "dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10",
           "x-show": "open",
           "@click.away": "close()" do

        Guest::Status.values.each do |status|
          button status.to_s,
            class: "btn btn-sm btn-ghost justify-start",
            **hx_put(Guests::UpdateStatus.with(guest.id).path),
            **hx_vals({"status" => status.to_s}),
            **hx_target("#guest-#{guest.id}"),
            **hx_swap("outerHTML")
        end
      end
    end
  end
end
```

**Create htmx endpoint:**
**File: `src/actions/guests/update_status.cr`**

```crystal
class Guests::UpdateStatus < BrowserAction
  put "/guests/:guest_id/status" do
    guest = GuestQuery.find(guest_id)
    event = guest.event!

    # Authorization check
    if event.creator_id != current_user.id
      if htmx_request?
        head 403
      else
        redirect_back fallback: Home::Index
      end
      return
    end

    # Parse and update status
    status_value = params.get("status")
    SaveGuest.update!(guest, status: Guest::Status.parse(status_value))

    if htmx_request?
      # Return just the updated guest row
      html Guests::GuestRow,
        guest: guest.reload,
        current_user: current_user,
        is_organizer: true
    else
      redirect_back fallback: Events::Show.with(guest.event_id)
    end
  end
end
```

**Update Events::ShowPage to use component:**
```crystal
private def render_guest_item(guest : Guest)
  mount Guests::GuestRow,
    guest: guest,
    current_user: current_user,
    is_organizer: is_organizer?
end
```

### 4.2 Collapsible Task Cards with Comments

**Create enhanced task card:**
**File: `src/components/tasks/task_card.cr`**

```crystal
class Tasks::TaskCard < BaseComponent
  needs task : Task
  needs comments : Array(Comment)
  needs current_user : User
  needs is_organizer : Bool

  def render
    div id: "task-#{task.id}",
        class: "card bg-base-200",
        "x-data": "collapsible" do

      div class: "card-body p-4" do
        # Task header
        div class: "flex items-center justify-between" do
          div class: "flex items-center gap-3 flex-1",
              "@click": "toggle()",
              class: "cursor-pointer" do

            # Status icon with htmx toggle
            button **hx_post(Tasks::ToggleStatus.with(task.id).path),
                   **hx_target("#task-#{task.id}"),
                   **hx_swap("outerHTML"),
                   class: "btn btn-ghost btn-sm btn-circle",
                   "@click.stop": "" do
              mount UI::TaskStatusIcon, status: task.status
            end

            div class: "flex-1" do
              span task.name, class: "font-semibold"

              if guest = task.guest
                small " • #{guest.user!.name}", class: "text-sm text-base-content/60"
              end
            end

            # Comment count badge
            if comments.any?
              span comments.size.to_s,
                   class: "badge badge-sm",
                   "x-show": "!expanded"
            end

            # Expand indicator
            icon "chevron-down",
                 "w-4 h-4 transition-transform",
                 ":class": "{ 'rotate-180': expanded }"
          end

          # Action buttons
          if is_organizer
            render_task_actions
          end
        end

        # Expandable comments section
        div "x-show": "expanded",
            "x-transition:enter": "transition ease-out duration-200",
            "x-transition:enter-start": "opacity-0 max-h-0",
            "x-transition:enter-end": "opacity-100 max-h-screen",
            class: "mt-4 pt-4 border-t border-base-300" do

          # Comments list
          div id: "task-#{task.id}-comments", class: "space-y-2 mb-4" do
            comments.each do |comment|
              mount UI::Comment, comment: comment
            end
          end

          # Add comment form with htmx
          render_comment_form
        end
      end
    end
  end

  private def render_comment_form
    form **hx_post(Comments::Create.path),
         **hx_target("#task-#{task.id}-comments"),
         **hx_swap("beforeend"),
         "x-data": "{ content: '' }",
         class: "flex gap-2" do

      input type: "hidden", name: "comment:commentable_type", value: "Task"
      input type: "hidden", name: "comment:commentable_id", value: task.id.to_s

      tag "textarea",
          name: "comment:content",
          "x-model": "content",
          placeholder: r("comments.add_comment").t,
          class: "textarea textarea-bordered textarea-sm flex-1",
          rows: "2"

      button r("comments.post").t,
             class: "btn btn-sm btn-primary",
             "@click": "content = ''",
             type: "submit"
    end
  end

  private def render_task_actions
    div class: "flex gap-1" do
      # Delete button
      button **hx_delete(Tasks::Delete.with(task.id).path),
             **hx_target("#task-#{task.id}"),
             **hx_swap("outerHTML swap:0.3s"),
             **hx_confirm("Are you sure?"),
             class: "btn btn-sm btn-ghost btn-square" do
        icon "trash", "w-4 h-4"
      end
    end
  end
end

# Note: hx_confirm is htmx 2.0 feature, replaces data_confirm
```

**Create comment creation endpoint:**
**File: `src/actions/comments/create.cr`**

```crystal
class Comments::Create < BrowserAction
  post "/comments" do
    commentable_type = params.get("comment:commentable_type")
    commentable_id = params.get("comment:commentable_id").to_i64
    content = params.get("comment:content")

    comment = Comment.create!(
      user_id: current_user.id,
      commentable_type: commentable_type,
      commentable_id: commentable_id,
      content: content
    )

    if htmx_request?
      # Return just the new comment
      html UI::Comment, comment: comment.reload
    else
      redirect_back fallback: Home::Index
    end
  end
end
```

### 4.3 Live Search with Alpine

**Enhance UI::SearchBox for client-side filtering:**
**File: `src/components/ui/search_box_alpine.cr`**

```crystal
class UI::SearchBoxAlpine < BaseComponent
  needs placeholder : String
  needs target_selector : String
  needs search_attribute : String = "name"

  def render
    div "x-data": "{ query: '' }", class: "form-control max-w-md" do
      div class: "input-group" do
        input type: "text",
              "x-model": "query",
              placeholder: placeholder,
              class: "input input-bordered w-full"

        div class: "btn btn-square" do
          icon "search", "w-5 h-5"
        end
      end
    end
  end
end
```

**Usage in Events::ShowPage:**
```crystal
# Add search functionality to guest list
div class: "mb-4", "x-data": "{ query: '' }" do
  div class: "form-control max-w-md" do
    div class: "input-group" do
      input type: "text",
            "x-model": "query",
            placeholder: r("search.guests").t,
            class: "input input-bordered w-full"
      div class: "btn btn-square" do
        icon "search", "w-5 h-5"
      end
    end
  end
end

# Filter guests by search query
div class: "space-y-2" do
  guests.each do |guest|
    div "x-show": "!query || '#{guest.user!.name.downcase}'.includes(query.toLowerCase())" do
      mount Guests::GuestRow,
        guest: guest,
        current_user: current_user,
        is_organizer: is_organizer?
    end
  end
end
```

### 4.4 Real-time Guest Stats with Polling

**Update guest stats section:**
```crystal
private def render_guest_stats
  div id: "guest-stats",
      **hx_get(Events::GuestStats.with(event.id).path),
      **hx_trigger("every 30s"),
      class: "stats shadow w-full" do

    render_guest_stats_content
  end
end

private def render_guest_stats_content
  confirmed = guests.count { |g| g.status == Guest::Status::Confirmed }
  pending = guests.count { |g| g.status == Guest::Status::NoAnswer }
  declined = guests.count { |g| g.status == Guest::Status::Declined }

  mount UI::StatsWidget, stats: [
    UI::StatsWidget::Stat.new(
      title: r("events.confirmed_count").t(count: confirmed),
      value: confirmed.to_s,
      color: "text-success"
    ),
    UI::StatsWidget::Stat.new(
      title: r("events.pending_count").t(count: pending),
      value: pending.to_s,
      color: "text-warning"
    ),
    UI::StatsWidget::Stat.new(
      title: r("events.declined_count").t(count: declined),
      value: declined.to_s,
      color: "text-error"
    )
  ]
end
```

**Create polling endpoint:**
**File: `src/actions/events/guest_stats.cr`**

```crystal
class Events::GuestStats < BrowserAction
  get "/events/:event_id/guest-stats" do
    event = EventQuery.find(event_id)
    guests = GuestQuery.new.event_id(event_id).preload_user.results

    if htmx_request?
      # Render just the stats widget
      confirmed = guests.count { |g| g.status == Guest::Status::Confirmed }
      pending = guests.count { |g| g.status == Guest::Status::NoAnswer }
      declined = guests.count { |g| g.status == Guest::Status::Declined }

      html_string do
        mount UI::StatsWidget, stats: [
          UI::StatsWidget::Stat.new(
            title: r("events.confirmed_count").t(count: confirmed),
            value: confirmed.to_s,
            color: "text-success"
          ),
          UI::StatsWidget::Stat.new(
            title: r("events.pending_count").t(count: pending),
            value: pending.to_s,
            color: "text-warning"
          ),
          UI::StatsWidget::Stat.new(
            title: r("events.declined_count").t(count: declined),
            value: declined.to_s,
            color: "text-error"
          )
        ]
      end
    else
      head 404
    end
  end
end
```

### 4.5 Quick Add Task Form

**Add to Events::ShowPage task section:**
```crystal
private def render_tasks_section
  div class: "card bg-base-100 shadow-xl" do
    div class: "card-body" do
      div class: "flex items-center justify-between mb-4" do
        h2 r("events.task_list").t, class: "card-title text-2xl"

        if is_organizer?
          # Quick add button with Alpine
          div "x-data": "{ showQuickAdd: false }" do
            button "@click": "showQuickAdd = !showQuickAdd",
                   class: "btn btn-sm btn-primary" do
              icon "plus", "w-4 h-4"
              text " " + r("events.add_task").t
            end

            # Inline form (hidden by default)
            div "x-show": "showQuickAdd",
                "x-transition",
                class: "mt-4",
                "x-cloak" do
              render_quick_add_task_form
            end
          end
        end
      end

      # Task list
      if tasks.empty?
        mount UI::EmptyState,
          title: r("dashboard.no_tasks").t,
          icon_name: "clipboard-list",
          with_card: false
      else
        div id: "task-list", class: "space-y-3" do
          tasks.each do |task|
            mount Tasks::TaskCard,
              task: task,
              comments: task_comments[task.id]? || [] of Comment,
              current_user: current_user,
              is_organizer: is_organizer?
          end
        end
      end
    end
  end
end

private def render_quick_add_task_form
  form **hx_post(Tasks::QuickCreate.with(event.id).path),
       **hx_target("#task-list"),
       **hx_swap("afterbegin"),
       "x-data": "{ taskName: '' }",
       "@htmx:after-request": "taskName = ''; showQuickAdd = false",
       class: "space-y-2" do

    mount UI::FormInput,
      label_text: r("tasks.name").t,
      name: "task:name",
      placeholder: r("tasks.placeholder.name").t,
      alpine_model: "taskName",
      required: true,
      autofocus: true

    div class: "flex gap-2" do
      mount UI::Button,
        text: r("actions.add").t,
        type: "submit",
        variant: "primary",
        size: "sm"

      button "@click": "showQuickAdd = false",
             type: "button",
             class: "btn btn-sm btn-ghost" do
        text r("actions.cancel").t
      end
    end
  end
end
```

**Create quick create endpoint:**
**File: `src/actions/tasks/quick_create.cr`**

```crystal
class Tasks::QuickCreate < BrowserAction
  post "/events/:event_id/tasks/quick" do
    event = EventQuery.find(event_id)

    # Authorization check
    if event.creator_id != current_user.id
      if htmx_request?
        head 403
      else
        redirect_back fallback: Events::Show.with(event_id)
      end
      return
    end

    task_name = params.get("task:name")

    task = Task.create!(
      event_id: event_id,
      name: task_name,
      status: Task::Status::Pending
    )

    if htmx_request?
      # Return new task card
      html Tasks::TaskCard,
        task: task,
        comments: [] of Comment,
        current_user: current_user,
        is_organizer: true
    else
      redirect to: Events::Show.with(event_id)
    end
  end
end
```

---

## 5. Advanced Features

### 5.1 Optimistic UI Updates

**Example for task completion:**
```crystal
button **hx_post(Tasks::Complete.with(task.id).path),
       **hx_target("#task-#{task.id}"),
       **hx_swap("outerHTML swap:0.5s"),
       "hx-on::before-request": "this.closest('.card').classList.add('opacity-50')",
       "hx-on::after-request": "this.closest('.card')?.classList.remove('opacity-50')",
       class: "btn btn-sm btn-success" do
  text r("tasks.complete").t
end
```

### 5.2 Infinite Scroll for Activity Feed

```crystal
# In activity feed rendering
div class: "space-y-3" do
  activities.each do |activity|
    mount Events::ActivityItem, activity: activity
  end

  # Load more trigger (only if there are more activities)
  if activities.size >= 20
    div **hx_get(Events::Activities.with(event.id).path(page: page + 1)),
        **hx_trigger("intersect once"),
        **hx_swap("beforebegin"),
        class: "text-center py-4" do
      mount UI::LoadingSpinner, size: "sm", show_by_default: true
    end
  end
end
```

### 5.3 Inline Editing with Alpine

**Create inline edit component:**
**File: `src/components/ui/inline_edit.cr`**

```crystal
class UI::InlineEdit < BaseComponent
  needs value : String
  needs field_name : String
  needs update_url : String
  needs display_class : String = ""
  needs placeholder : String = ""

  def render
    div "x-data": "{ editing: false, value: '#{escape_js(value)}', saving: false }",
        class: "inline-edit" do

      # Display mode
      div "x-show": "!editing",
          "@click": "editing = true",
          class: "cursor-pointer hover:bg-base-200 p-2 rounded transition #{display_class}" do
        span "x-text": "value || '#{escape_js(placeholder)}'",
             class: value.empty? ? "text-base-content/50 italic" : ""
        icon "edit", "w-3 h-3 ml-2 opacity-50 inline"
      end

      # Edit mode
      form "x-show": "editing",
           "x-cloak",
           **hx_put(update_url),
           **hx_swap("none"),
           "@htmx:before-request": "saving = true",
           "@htmx:after-request": "saving = false; editing = false",
           class: "flex gap-2" do

        input type: "text",
              name: field_name,
              "x-model": "value",
              placeholder: placeholder,
              class: "input input-sm input-bordered flex-1",
              "@blur": "if (!saving) editing = false",
              "@keydown.escape": "editing = false; value = '#{escape_js(value)}'"

        button r("actions.save").t,
               class: "btn btn-sm btn-primary",
               type: "submit",
               "x-bind:disabled": "saving" do
          span "x-show": "!saving" do
            text r("actions.save").t
          end
          span "x-show": "saving" do
            mount UI::LoadingSpinner, size: "sm"
          end
        end
      end
    end
  end

  private def escape_js(str : String)
    str.gsub("'", "\\'").gsub("\n", "\\n")
  end
end
```

**Usage:**
```crystal
mount UI::InlineEdit,
  value: event.name,
  field_name: "event:name",
  update_url: Events::UpdateField.with(event.id).path,
  display_class: "text-2xl font-bold"
```

### 5.4 Dependent Dropdowns with htmx

**Example: Category filters available tasks**

```crystal
div "x-data": "{ category: '' }" do
  # Category select
  mount UI::FormSelect(String),
    label_text: r("tasks.category").t,
    name: "category",
    options: [{"", "All Categories"}] + TASK_CATEGORIES.map { |c| {c, c} },
    hx_attributes: {
      "hx-get" => Tasks::ByCategory.path,
      "hx-target" => "#task-select",
      "hx-include" => "[name='category']"
    }

  # Task select (populated via htmx)
  div id: "task-select", class: "mt-4" do
    mount UI::FormSelect(Task),
      label_text: r("tasks.select_task").t,
      name: "task_id",
      options: [] of Task,
      prompt: r("tasks.select_category_first").t
  end
end
```

### 5.5 Confirmation Dialog with Alpine

Replace `data_confirm` with better UX:

**File: `src/components/ui/confirm_dialog.cr`**

```crystal
class UI::ConfirmDialog < BaseComponent
  needs id : String
  needs message : String
  needs confirm_text : String = "Confirm"
  needs cancel_text : String = "Cancel"
  needs variant : String = "error"

  def render
    div "x-data": "{ confirmAction: null }",
        "@confirm-#{id}.window": "confirmAction = $event.detail.action",
        id: "confirm-dialog-#{id}" do

      # Modal
      mount UI::Modal, id: "confirm-#{id}", title: "Confirm Action", closeable: true do
        para message, class: "mb-4"

        div class: "modal-action" do
          button cancel_text,
                 class: "btn btn-ghost",
                 "@click": "$dispatch('close-modal-confirm-#{id}')"

          button confirm_text,
                 class: "btn btn-#{variant}",
                 "@click": "if (confirmAction) confirmAction(); $dispatch('close-modal-confirm-#{id}')"
        end
      end
    end
  end
end
```

**Usage:**
```crystal
# In page, add the dialog
mount UI::ConfirmDialog,
  id: "delete-task",
  message: "Are you sure you want to delete this task?",
  confirm_text: "Delete",
  variant: "error"

# In button/link
button "@click": "
  $dispatch('open-modal-confirm-delete-task');
  $dispatch('confirm-delete-task', {
    action: () => htmx.ajax('DELETE', '#{Tasks::Delete.with(task.id).path}', {target: '#task-#{task.id}', swap: 'outerHTML'})
  })
",
  class: "btn btn-sm btn-error" do
  text "Delete"
end
```

---

## 6. Testing Strategy

### 6.1 Unit Tests for Alpine Components
**File: `spec/javascript/alpine/components.spec.js`** (if using Jest)

```javascript
import { notification, modal, collapsible } from '../../../src/js/alpine/components';

describe('Alpine Components', () => {
  describe('notification', () => {
    it('shows and hides notification', () => {
      const notif = notification();
      expect(notif.visible).toBe(false);

      notif.show('Test message', 'success');
      expect(notif.visible).toBe(true);
      expect(notif.message).toBe('Test message');

      notif.hide();
      expect(notif.visible).toBe(false);
    });
  });

  describe('collapsible', () => {
    it('toggles expanded state', () => {
      const c = collapsible(false);
      expect(c.expanded).toBe(false);

      c.toggle();
      expect(c.expanded).toBe(true);

      c.toggle();
      expect(c.expanded).toBe(false);
    });
  });
});
```

### 6.2 Integration Tests for htmx Endpoints

**File: `spec/actions/guests/update_status_spec.cr`**

```crystal
describe Guests::UpdateStatus do
  it "updates guest status via htmx" do
    user = UserFactory.create
    event = EventFactory.create &.creator_id(user.id)
    guest = GuestFactory.create &.event_id(event.id).user_id(user.id)

    response = ApiClient.auth(user)
      .header("HX-Request", "true")
      .exec(
        Guests::UpdateStatus.with(guest.id),
        status: "confirmed"
      )

    response.status.should eq(200)
    guest.reload.status.should eq(Guest::Status::Confirmed)

    # Check htmx response contains updated guest row
    response.body.should contain("guest-#{guest.id}")
  end

  it "returns 403 for non-organizers" do
    organizer = UserFactory.create
    other_user = UserFactory.create
    event = EventFactory.create &.creator_id(organizer.id)
    guest = GuestFactory.create &.event_id(event.id).user_id(other_user.id)

    response = ApiClient.auth(other_user)
      .header("HX-Request", "true")
      .exec(
        Guests::UpdateStatus.with(guest.id),
        status: "confirmed"
      )

    response.status.should eq(403)
  end
end
```

### 6.3 E2E Tests with Playwright

**Example Playwright test:**

```javascript
// spec/e2e/guest_management.spec.js
import { test, expect } from '@playwright/test';

test('update guest status with htmx', async ({ page }) => {
  // Setup: Login and navigate to event
  await page.goto('/sign-in');
  await page.fill('input[name="user:email"]', 'organizer@test.com');
  await page.fill('input[name="user:password"]', 'password');
  await page.click('button[type="submit"]');

  await page.goto('/events/1');

  // Click status dropdown for guest
  await page.click('[data-guest-id="1"] .dropdown button');

  // Select "Confirmed"
  await page.click('button:has-text("Confirmed")');

  // Wait for htmx to update
  await page.waitForResponse(resp =>
    resp.url().includes('/guests/1/status') && resp.status() === 200
  );

  // Verify badge updated without page reload
  const badge = await page.locator('[data-guest-id="1"] .badge');
  await expect(badge).toHaveText('Confirmed');
  await expect(badge).toHaveClass(/badge-success/);
});

test('quick add task with htmx', async ({ page }) => {
  await page.goto('/events/1');

  // Click "Add Task" button
  await page.click('button:has-text("Add Task")');

  // Form should appear (Alpine animation)
  await expect(page.locator('form')).toBeVisible();

  // Fill in task name
  await page.fill('input[name="task:name"]', 'New test task');

  // Submit form
  await page.click('button[type="submit"]:has-text("Add")');

  // Wait for htmx response
  await page.waitForResponse(resp =>
    resp.url().includes('/tasks/quick') && resp.status() === 200
  );

  // Verify task appears in list
  await expect(page.locator('#task-list')).toContainText('New test task');

  // Form should close
  await expect(page.locator('form')).not.toBeVisible();
});
```

---

## 7. Performance Optimizations

### 7.1 Debouncing Search Inputs

```crystal
# In search box with Alpine
div "x-data": "{ query: '' }", class: "form-control max-w-md" do
  input type: "text",
        "x-model": "query",
        "@input.debounce.300ms": "
          htmx.ajax('GET', '/search?q=' + query, {target: '#results', swap: 'innerHTML'})
        ",
        placeholder: r("search.guests").t,
        class: "input input-bordered"
end
```

### 7.2 Request Caching Strategy

```javascript
// In app.js
htmx.config.getCacheBusterParam = false;
htmx.config.historyCacheSize = 20;

// Cache GET requests for stats
document.body.addEventListener('htmx:configRequest', (event) => {
  if (event.detail.verb === 'get' && event.detail.path.includes('/stats')) {
    event.detail.headers['Cache-Control'] = 'max-age=30';
  }
});
```

### 7.3 Prefetching Next Actions

```crystal
# Prefetch modal content on hover
link "Edit Event",
     to: Events::Edit.with(event.id),
     class: "btn btn-ghost",
     **hx_get(Events::Edit.with(event.id).path),
     **hx_trigger("mouseenter once"),
     **hx_target("body"),
     **hx_swap("none")
```

### 7.4 Lazy Loading Images

```crystal
# For event images
img "data-src": event.image_url,
    class: "lazy",
    **hx_trigger("intersect once"),
    **hx_get(Events::LoadImage.with(event.id).path),
    **hx_swap("outerHTML")
```

---

## Implementation Timeline

### Phase 1: Foundation (Week 1) ✅ COMPLETED
- [x] Update dependencies (htmx 2.0, Alpine.js)
- [x] Configure JavaScript bundle
- [x] Create htmx helper module
- [x] Setup Alpine component store
- [x] Add toast notification system
- [x] Create LoadingSpinner component
- [x] Update BaseComponent to include HtmxHelper
- [x] Remove unpkg CDN link from LayoutHead
- [x] Add ToastContainer to MainLayout
- [x] **Migrated to Bun** (from yarn)
- [x] JavaScript builds successfully (0.89 MB bundle with bun)

**Status**: Foundation complete! htmx 2.0 and Alpine.js are installed and configured. Using Bun for faster builds.

### Phase 2: Core Interactivity (Week 2)
- [ ] Implement inline guest status updates
- [ ] Add collapsible task cards with comments
- [ ] Implement quick add task form
- [ ] Add live search filtering
- [ ] Create modal system

### Phase 3: Advanced Features (Week 3)
- [ ] Real-time guest stats polling
- [ ] Inline editing for event details
- [ ] Dependent dropdown forms
- [ ] Optimistic UI updates
- [ ] Better confirmation dialogs

### Phase 4: Polish & Testing (Week 4)
- [ ] Performance optimizations
- [ ] Comprehensive testing (unit, integration, E2E)
- [ ] Accessibility improvements
- [ ] Documentation
- [ ] Production deployment

---

## Success Metrics

1. **Performance**
   - Initial page load < 2s
   - Time to interactive < 3s
   - htmx requests < 500ms
   - No layout shifts (CLS < 0.1)

2. **User Experience**
   - 80% reduction in full page reloads
   - Instant feedback on all interactions
   - Smooth 60fps animations
   - Zero loss of functionality

3. **Code Quality**
   - Test coverage > 80%
   - No console errors in production
   - Accessibility score > 95
   - Works without JavaScript (progressive enhancement)

---

## Migration Strategy

### For Existing Components

1. **Start with high-value, low-risk components:**
   - UI::Card → Add htmx_indicator support ✓
   - UI::Button → Add hx_attributes support ✓
   - UI::FormInput → Add Alpine validation ✓

2. **Test incrementally:**
   - Add feature to one page
   - Test thoroughly
   - Roll out to similar pages

3. **Keep fallbacks:**
   - Ensure all htmx endpoints work as regular HTTP
   - Maintain progressive enhancement
   - Test with JavaScript disabled

### For New Features

All new interactive features should use htmx + Alpine by default:
- Form submissions → htmx
- Client-side state → Alpine
- Server updates → htmx
- UI interactions → Alpine

---

## Resources

- [htmx 2.0 Documentation](https://v2-0v2-0.htmx.org/)
- [Alpine.js Documentation](https://alpinejs.dev/)
- [Lucky Framework Guides](https://luckyframework.org/guides)
- [DaisyUI Components](https://daisyui.com/components/)
- [Your existing component docs](docs/COMPONENT_IMPLEMENTATION_SUMMARY.md)

---

## Notes

- **Leverage existing components:** Build on the 19 UI components you already have
- **Use htmx for server interactions:** All data fetching and mutations
- **Use Alpine for client-side state:** Dropdowns, modals, tabs, etc.
- **Maintain progressive enhancement:** Everything should work without JavaScript
- **Keep JavaScript minimal:** Server does the heavy lifting
- **Test across browsers:** Chrome, Firefox, Safari
- **Ensure mobile responsiveness:** Touch-friendly interactions
- **Follow WCAG 2.1 AA:** Keyboard navigation, screen readers

---

## Quick Reference: htmx Attributes

```crystal
# Common htmx patterns in Lucky/Crystal

# GET request
**hx_get("/path"), **hx_target("#result"), **hx_swap("innerHTML")

# POST with data
**hx_post("/path"), **hx_vals({"key" => "value"}), **hx_target("#result")

# Triggers
**hx_trigger("click")           # Default
**hx_trigger("change")          # For inputs
**hx_trigger("every 30s")       # Polling
**hx_trigger("intersect once")  # Lazy load

# Swapping strategies
**hx_swap("innerHTML")     # Replace inner content (default)
**hx_swap("outerHTML")     # Replace entire element
**hx_swap("beforebegin")   # Insert before element
**hx_swap("afterbegin")    # Insert at start of element
**hx_swap("beforeend")     # Insert at end of element
**hx_swap("afterend")      # Insert after element

# Combined with helper
**hx_attrs(
  get: "/path",
  target: "#result",
  swap: "innerHTML",
  trigger: "click"
)
```

## Quick Reference: Alpine Patterns

```crystal
# Alpine directives in Lucky components

# Data initialization
"x-data": "{ open: false, query: '' }"

# Showing/hiding
"x-show": "open"
"x-cloak": true  # Hide until Alpine loads

# Event handling
"@click": "open = !open"
"@click.away": "open = false"
"@keydown.escape": "open = false"

# Model binding
"x-model": "query"

# Transitions
"x-transition"
"x-transition:enter": "transition ease-out duration-300"

# Text/HTML binding
"x-text": "message"
"x-html": "content"

# Conditionals
":class": "{ 'active': open }"
":disabled": "loading"
```

---

*This plan integrates seamlessly with your existing 19 UI components and follows the proven patterns from your component refactoring work.*
